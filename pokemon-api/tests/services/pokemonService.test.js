
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

});