

const PokemonRepository = require('../../src/repositories/pokemonRepository.js');
const db = require('../../src/database/database.js');

jest.mock('../../src/database/database.js', () => ({
    prepare: jest.fn()
}));

const mockStatement = (retorno) => ({
    all: jest.fn().mockReturnValue(retorno),
    get: jest.fn().mockReturnValue(retorno),
    run: jest.fn().mockReturnValue(retorno)
});

describe('PokemonRepository', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('listarTodos - deve retornar todos os pokemons', () => {
        const fakeLista = [{ id: 1, name: 'pikachu' }];
        db.prepare.mockReturnValue(mockStatement(fakeLista));

        const resultado = PokemonRepository.listarTodos();

        expect(resultado).toEqual(fakeLista);
    });

    test('buscarPorId - deve retornar pokemon pelo id', () => {
        const fakePokemon = { id: 1, name: 'pikachu' };
        db.prepare.mockReturnValue(mockStatement(fakePokemon));

        const resultado = PokemonRepository.buscarPorId(1);

        expect(resultado).toEqual(fakePokemon);
    });

    test('buscarPorId - deve retornar null quando nao encontrado', () => {
        db.prepare.mockReturnValue(mockStatement(null));

        const resultado = PokemonRepository.buscarPorId(999);

        expect(resultado).toBeNull();
    });

    test('buscarPorTipo - deve retornar pokemons pelo tipo', () => {
        const fakeLista = [{ id: 1, name: 'pikachu', type: 'electric' }];
        db.prepare.mockReturnValue(mockStatement(fakeLista));

        const resultado = PokemonRepository.buscarPorTipo('electric');

        expect(resultado).toEqual(fakeLista);
    });

    test('buscarPorTipo - deve retornar lista vazia quando nao encontrado', () => {
        db.prepare.mockReturnValue(mockStatement([]));

        const resultado = PokemonRepository.buscarPorTipo('invalido');

        expect(resultado).toEqual([]);
    });

    test('maisFortes - deve retornar os 5 pokemons com maior ataque', () => {
        const fakeLista = [{ id: 1, name: 'dragonite', attack: 134 }];
        db.prepare.mockReturnValue(mockStatement(fakeLista));

        const resultado = PokemonRepository.maisFortes();

        expect(resultado).toEqual(fakeLista);
    });

    test('resumoEstatisticas - deve retornar estatisticas dos pokemons', () => {
        const fakeStats = { total: 10, media_hp: 50.0 };
        db.prepare.mockReturnValue(mockStatement(fakeStats));

        const resultado = PokemonRepository.resumoEstatisticas();

        expect(resultado).toEqual(fakeStats);
    });

    test('salvar - deve inserir pokemon e retornar resultado', () => {
        const fakeResultado = { lastInsertRowid: 1 };
        db.prepare.mockReturnValue(mockStatement(fakeResultado));

        const pokemon = {
            poke_id: 25,
            name: 'pikachu',
            type: 'electric',
            hp: 35,
            attack: 55,
            defense: 40,
            sprite: 'url'
        };

        const resultado = PokemonRepository.salvar(pokemon);

        expect(resultado).toEqual(fakeResultado);
    });

    test('atualizar - deve atualizar pokemon e retornar resultado', () => {
        const fakeResultado = { changes: 1 };
        db.prepare.mockReturnValue(mockStatement(fakeResultado));

        const resultado = PokemonRepository.atualizar(1, {
            name: 'raichu',
            type: 'electric',
            hp: 60,
            attack: 90,
            defense: 55
        });

        expect(resultado).toEqual(fakeResultado);
    });

    test('atualizarParcial - deve atualizar campos parcialmente', () => {
        const fakeResultado = { changes: 1 };
        db.prepare.mockReturnValue(mockStatement(fakeResultado));

        const resultado = PokemonRepository.atualizarParcial(1, { hp: 100 });

        expect(resultado).toEqual(fakeResultado);
    });

    test('deletar - deve deletar pokemon e retornar resultado', () => {
        const fakeResultado = { changes: 1 };
        db.prepare.mockReturnValue(mockStatement(fakeResultado));

        const resultado = PokemonRepository.deletar(1);

        expect(resultado).toEqual(fakeResultado);
    });
});