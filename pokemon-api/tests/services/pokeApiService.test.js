

const { 
    buscarPokemonNaApi, 
    buscarVariosPokemonsNaApi 
} = require('../../src/services/pokeApiService.js');

jest.mock('axios');
const axios = require('axios');

const respostaFakeApi = {
    data: {
        id: 25,
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
        stats: [
            { base_stat: 35 }, 
            { base_stat: 55 }, 
            { base_stat: 40 }, 
        ],
        sprites: { front_default: 'url-da-imagem' }
    }
};

const pokemonEsperado = {
    poke_id: 25,
    name: 'pikachu',
    type: 'electric',
    hp: 35,
    attack: 55,
    defense: 40,
    sprite: 'url-da-imagem'
};

describe('pokeApiService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('buscarPokemonNaApi - deve retornar pokemon formatado com sucesso', async () => {

        axios.get.mockResolvedValue(respostaFakeApi);

        const resultado = await buscarPokemonNaApi('pikachu');

        expect(resultado).toEqual(pokemonEsperado);
        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    test('buscarPokemonNaApi - deve converter o nome para lowercase', async () => {

        axios.get.mockResolvedValue(respostaFakeApi);

        await buscarPokemonNaApi('PIKACHU');

        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('pikachu')
        );
    });

    test('buscarPokemonNaApi - deve lançar erro quando a API falhar', async () => {
  
        axios.get.mockRejectedValue(new Error('API fora do ar'));

        await expect(buscarPokemonNaApi('pikachu'))
            .rejects
            .toThrow();
    });

    test('buscarVariosPokemonsNaApi - deve retornar sucesso e falhas separados', async () => {

        axios.get
            .mockResolvedValueOnce(respostaFakeApi)
            .mockRejectedValueOnce(new Error('não encontrado'));

        const resultado = await buscarVariosPokemonsNaApi(['pikachu', 'pokemoninvalido']);

        expect(resultado.sucesso).toHaveLength(1);
        expect(resultado.falhas).toHaveLength(1);
        expect(resultado.falhas[0]).toEqual({
            nome: 'pokemoninvalido',
            erro: 'Pokemon nao encontrado na PokeAPI'
        });
    });

    test('buscarVariosPokemonsNaApi - deve retornar todos com sucesso', async () => {
   
        axios.get.mockResolvedValue(respostaFakeApi);

        const resultado = await buscarVariosPokemonsNaApi(['pikachu', 'gengar']);

        expect(resultado.sucesso).toHaveLength(2);
        expect(resultado.falhas).toHaveLength(0);
    });

});