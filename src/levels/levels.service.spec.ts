import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelWithMetadata } from './entities/level-with-metadata.entity';
import { LevelsService } from './levels.service';

describe('LevelService', () => {
    let service: LevelsService;
    let spy: jest.Mock;
    const mockRepository: Partial<Repository<LevelWithMetadata>> = {
        find: () => Promise.resolve([]),
        save: () => Promise.resolve([]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LevelsService,
                {
                    provide: getRepositoryToken(LevelWithMetadata),
                    useValue: mockRepository,
                },
            ],
        }).compile();
        service = module.get<LevelsService>(LevelsService);
        spy = jest.fn();
    });

    afterEach(() => spy.mockClear());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll() should return the database result', async () => {
        jest.spyOn(mockRepository, 'find');

        const result = await service.findAll();

        expect(result).toEqual([]);
        expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });

    it('createRandomLevel() should save to the database', async () => {
        mockRepository.save = spy;
        spy.mockImplementation(() => ({
            name: 'mock entity',
        }));

        const result = await service.createRandomLevel();

        expect(result).toEqual({ name: 'mock entity' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].name).toBe('Basic 4 Cities');
        expect(spy.mock.calls[0][0].levelJson).toBe(
            '{"cities":[{"name":"Athens","stock":6,"production":-1,"x":150,"y":100},{"name":"Bern","stock":6,"production":-1,"x":500,"y":200},{"name":"Cairo","stock":7,"production":-1,"x":150,"y":300},{"name":"Dublin","stock":8,"production":-1,"x":500,"y":400}],"travelPaths":[{"first":"Athens","second":"Bern"},{"first":"Dublin","second":"Cairo"},{"first":"Bern","second":"Cairo"},{"first":"Dublin","second":"Athens"}],"player":{"stock": 3,"location": "Athens"}}',
        );
    });

    it('create(..) should save correctly to the database', async () => {
        mockRepository.save = spy;
        spy.mockImplementation(() => ({
            name: 'mock entity',
        }));

        const result = await service.create({
            levelJson: 'my-level-json',
            name: 'my-name',
        });

        expect(result).toEqual({ name: 'mock entity' });
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][0].name).toBe('my-name');
        expect(spy.mock.calls[0][0].levelJson).toBe('my-level-json');
    });
});
