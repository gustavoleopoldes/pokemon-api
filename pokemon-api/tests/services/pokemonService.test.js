

const PokemonService = require('../../src/services/pokemonService.js');
const PokemonRepository = require('../../src/repositories/pokemonRepository.js');
const pokeApiService = require('../../src/services/pokeApiService.js');

jest.mock('../../src/repositories/pokemonRepository.js');
jest.mock('../../src/services/pokeApiService.js');

describe('PokemonService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('salvar - deve lançar erro quando name não for enviado', async () => {
        await expect(PokemonService.salvar(null))
            .rejects
            .toEqual({ status: 400, message: 'Envie o campo "name"' });
    });

    test('salvar - deve lançar erro quando pokemon não existe na PokeAPI', async () => {
        pokeApiService.buscarPokemonNaApi.mockRejectedValue({
            response: { status: 404 }
        });

        await expect(PokemonService.salvar('pokemoninvalido'))
            .rejects
            .toEqual({ status: 404, message: 'Pokemon nao encontrado na PokeAPI' });
    });

    test('salvar - deve salvar e retornar o pokemon com sucesso', async () => {
        const pokemonFake = {
            poke_id: 25,
            name: 'pikachu',
            type: 'electric',
            hp: 35,
            attack: 55,
            defense: 40,
            sprite: 'url-da-imagem'
        };

        pokeApiService.buscarPokemonNaApi.mockResolvedValue(pokemonFake);
        PokemonRepository.salvar.mockReturnValue({ lastInsertRowid: 1 });

        const resultado = await PokemonService.salvar('pikachu');

        expect(resultado).toEqual({ id: 1, ...pokemonFake });
        expect(pokeApiService.buscarPokemonNaApi).toHaveBeenCalledWith('pikachu');
        expect(PokemonRepository.salvar).toHaveBeenCalledTimes(1);
    });

    test('salvar - deve lançar erro quando pokemon já está salvo no banco', async () => {
        const pokemonFake = {
            poke_id: 25,
            name: 'pikachu',
            type: 'electric',
            hp: 35,
            attack: 55,
            defense: 40,
            sprite: 'url-da-imagem'
        };

        pokeApiService.buscarPokemonNaApi.mockResolvedValue(pokemonFake);
        PokemonRepository.salvar.mockImplementation(() => {
            throw { code: 'SQLITE_CONSTRAINT_UNIQUE' };
        });

        await expect(PokemonService.salvar('pikachu'))
            .rejects
            .toEqual({ status: 409, message: 'Esse Pokemon ja esta salvo no banco' });
    });

    test('importarVarios - deve lançar erro quando nomes nao for enviado', async () => {
        await expect(PokemonService.importarVarios(null))
            .rejects
            .toEqual({ status: 400, message: 'Envie um array "nomes" com os nomes dos pokémons' });
    });

    test('importarVarios - deve lançar erro quando nomes nao for array', async () => {
        await expect(PokemonService.importarVarios('pikachu'))
            .rejects
            .toEqual({ status: 400, message: 'Envie um array "nomes" com os nomes dos pokémons' });
    });

    test('importarVarios - deve lançar erro quando array estiver vazio', async () => {
        await expect(PokemonService.importarVarios([]))
            .rejects
            .toEqual({ status: 400, message: 'Envie um array "nomes" com os nomes dos pokémons' });
    });

    test('importarVarios - deve lançar erro quando array tiver mais de 20 itens', async () => {
        const nomes = Array(21).fill('pikachu');

        await expect(PokemonService.importarVarios(nomes))
            .rejects
            .toEqual({ status: 400, message: 'Máximo de 20 pokémons por vez' });
    });

    test('importarVarios - deve importar e retornar resultados com sucesso', async () => {
        const fakeResultados = [{ name: 'pikachu', salvo: true }];

        pokeApiService.buscarVariosPokemonsNaApi.mockResolvedValue({
            sucesso: [{ name: 'pikachu' }],
            falhas: []
        });
        PokemonRepository.salvarVarios.mockReturnValue(fakeResultados);

        const resultado = await PokemonService.importarVarios(['pikachu']);

        expect(resultado).toEqual(fakeResultados);
    });

    test('listarTodos - deve retornar lista de pokemons', () => {
        const fakeLista = [{ id: 1, name: 'pikachu' }];
        PokemonRepository.listarTodos.mockReturnValue(fakeLista);

        const resultado = PokemonService.listarTodos();

        expect(resultado).toEqual(fakeLista);
        expect(PokemonRepository.listarTodos).toHaveBeenCalledTimes(1);
    });

    test('buscarPorId - deve retornar pokemon quando encontrado', () => {
        const fakePokemon = { id: 1, name: 'pikachu' };
        PokemonRepository.buscarPorId.mockReturnValue(fakePokemon);

        const resultado = PokemonService.buscarPorId(1);

        expect(resultado).toEqual(fakePokemon);
        expect(PokemonRepository.buscarPorId).toHaveBeenCalledWith(1);
    });

    test('buscarPorId - deve lançar erro quando pokemon nao encontrado', () => {
        PokemonRepository.buscarPorId.mockReturnValue(null);

        expect(() => PokemonService.buscarPorId(999))
            .toThrow();
    });

    test('buscarPorTipo - deve retornar pokemons do tipo', () => {
        const fakeLista = [{ id: 1, name: 'pikachu', type: 'electric' }];
        PokemonRepository.buscarPorTipo.mockReturnValue(fakeLista);

        const resultado = PokemonService.buscarPorTipo('electric');

        expect(resultado).toEqual(fakeLista);
    });

    test('buscarPorTipo - deve lançar erro quando nenhum pokemon encontrado', () => {
        PokemonRepository.buscarPorTipo.mockReturnValue([]);

        expect(() => PokemonService.buscarPorTipo('invalido'))
            .toThrow();
    });

    test('maisFortes - deve retornar os pokemons mais fortes', () => {
        const fakeLista = [{ id: 1, name: 'dragonite' }];
        PokemonRepository.maisFortes.mockReturnValue(fakeLista);

        const resultado = PokemonService.maisFortes();

        expect(resultado).toEqual(fakeLista);
    });

    test('maisFortes - deve lançar erro quando nenhum pokemon cadastrado', () => {
        PokemonRepository.maisFortes.mockReturnValue([]);

        expect(() => PokemonService.maisFortes())
            .toThrow();
    });

    test('resumoEstatisticas - deve retornar as estatisticas', () => {
        const fakeStats = { total: 10, media_hp: 50 };
        PokemonRepository.resumoEstatisticas.mockReturnValue(fakeStats);

        const resultado = PokemonService.resumoEstatisticas();

        expect(resultado).toEqual(fakeStats);
        expect(PokemonRepository.resumoEstatisticas).toHaveBeenCalledTimes(1);
    });

    test('atualizar - deve atualizar e retornar o pokemon', () => {
        const fakePokemon = { id: 1, name: 'pikachu', type: 'electric', hp: 35, attack: 55, defense: 40 };
        const fakeAtualizado = { ...fakePokemon, name: 'raichu' };

        PokemonRepository.buscarPorId
            .mockReturnValueOnce(fakePokemon)
            .mockReturnValueOnce(fakeAtualizado);
        PokemonRepository.atualizar.mockReturnValue({ changes: 1 });

        const resultado = PokemonService.atualizar(1, { name: 'raichu' });

        expect(PokemonRepository.atualizar).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual(fakeAtualizado);
    });

    test('atualizar - deve lançar erro quando pokemon nao encontrado', () => {
        PokemonRepository.buscarPorId.mockReturnValue(null);

        expect(() => PokemonService.atualizar(999, { name: 'raichu' }))
            .toThrow();
    });

    test('atualizarParcial - deve atualizar parcialmente e retornar o pokemon', () => {
        const fakePokemon = { id: 1, name: 'pikachu', hp: 35 };
        const fakeAtualizado = { ...fakePokemon, hp: 100 };

        PokemonRepository.buscarPorId
            .mockReturnValueOnce(fakePokemon)
            .mockReturnValueOnce(fakeAtualizado);
        PokemonRepository.atualizarParcial.mockReturnValue({ changes: 1 });

        const resultado = PokemonService.atualizarParcial(1, { hp: 100 });

        expect(PokemonRepository.atualizarParcial).toHaveBeenCalledTimes(1);
        expect(resultado).toEqual(fakeAtualizado);
    });

    test('atualizarParcial - deve lançar erro quando pokemon nao encontrado', () => {
        PokemonRepository.buscarPorId.mockReturnValue(null);

        expect(() => PokemonService.atualizarParcial(999, { hp: 100 }))
            .toThrow();
    });

    test('atualizarParcial - deve lançar erro quando nenhum campo valido enviado', () => {
        const fakePokemon = { id: 1, name: 'pikachu' };
        PokemonRepository.buscarPorId.mockReturnValue(fakePokemon);

        expect(() => PokemonService.atualizarParcial(1, { campoInvalido: 'x' }))
            .toThrow();
    });

    test('deletar - deve deletar e retornar o pokemon', () => {
        const fakePokemon = { id: 1, name: 'pikachu' };
        PokemonRepository.buscarPorId.mockReturnValue(fakePokemon);
        PokemonRepository.deletar.mockReturnValue({ changes: 1 });

        const resultado = PokemonService.deletar(1);

        expect(resultado).toEqual(fakePokemon);
        expect(PokemonRepository.deletar).toHaveBeenCalledWith(1);
    });

    test('deletar - deve lançar erro quando pokemon nao encontrado', () => {
        PokemonRepository.buscarPorId.mockReturnValue(null);

        expect(() => PokemonService.deletar(999))
            .toThrow();
    });
});