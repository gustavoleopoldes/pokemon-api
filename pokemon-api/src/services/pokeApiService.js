


const axios = require('axios');

const POKEAPI_URL = 'https://pokeapi.co/api/v2/pokemon';

async function buscarPokemonNaApi(nome) {
    const resposta = await axios.get(
        `${POKEAPI_URL}/${nome.toLowerCase()}`
    );

    const dados = resposta.data;

    const pokemon = {
        poke_id: dados.id,
        name: dados.name,
        type: dados.types.map(t => t.type.name).join(', '),
        hp: dados.stats[0].base_stat,
        attack: dados.stats[1].base_stat,
        defense: dados.stats[2].base_stat,
        sprite: dados.sprites.front_default
    };

    return pokemon;
}

async function buscarVariosPokemonsNaApi(nomes) {
    const promessas = nomes.map(nome => buscarPokemonNaApi(nome));
    const resultados = await Promise.allSettled(promessas);

    const sucesso = [];
    const falhas = [];

    resultados.forEach((resultado, index) => {
        if (resultado.status === 'fulfilled') {
            sucesso.push(resultado.value);
        } else {
            falhas.push({ 
                nome: nomes[index], 
                erro: 'Pokemon nao encontrado na PokeAPI' 
            });
        }
    });

    return { sucesso, falhas };
}

module.exports = { buscarPokemonNaApi, buscarVariosPokemonsNaApi };