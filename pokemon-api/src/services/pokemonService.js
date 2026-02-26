

const PokemonRepository = require('../repositories/pokemonRepository.js');
const Pokemon = require('../models/Pokemon.js');
const { buscarPokemonNaApi, buscarVariosPokemonsNaApi } = require('./pokeApiService.js');

class PokemonService {

    static async salvar(name) {
        if (!name) {
            throw { status: 400, message: 'Envie o campo "name"' };
        }

        let dadosApi;
        try {
            dadosApi = await buscarPokemonNaApi(name);
        } catch (erro) {
            if (erro.response && erro.response.status === 404) {
                throw { status: 404, message: 'Pokemon nao encontrado na PokeAPI' };
            }
            throw { status: 500, message: 'Erro ao buscar na PokeAPI' };
        }

        const pokemon = new Pokemon(dadosApi);
        const validacao = pokemon.isValid();
        if (!validacao.valid) {
            throw { status: 400, message: validacao.message };
        }

        try {
            const resultado = PokemonRepository.salvar(pokemon);
            return { id: resultado.lastInsertRowid, ...dadosApi };
        } catch (erro) {
            if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
                throw { status: 409, message: 'Esse Pokemon ja esta salvo no banco' };
            }
            throw { status: 500, message: 'Erro ao salvar no banco' };
        }
    }

    static async importarVarios(nomes) {
        if (!nomes || !Array.isArray(nomes) || nomes.length === 0) {
            throw { status: 400, message: 'Envie um array "nomes" com os nomes dos pokémons' };
        }

        if (nomes.length > 20) {
            throw { status: 400, message: 'Máximo de 20 pokémons por vez' };
        }

        const { sucesso, falhas } = await buscarVariosPokemonsNaApi(nomes);
        const resultados = PokemonRepository.salvarVarios(sucesso);

        const todosResultados = [
            ...resultados,
            ...falhas.map(f => ({ name: f.nome, salvo: false, erro: f.erro }))
        ];

        return todosResultados;
    }

    static listarTodos() {
        return PokemonRepository.listarTodos();
    }

    static buscarPorId(id) {
        const pokemon = PokemonRepository.buscarPorId(id);
        if (!pokemon) {
            throw { status: 404, message: 'Pokemon nao encontrado' };
        }
        return pokemon;
    }

    static buscarPorTipo(tipo) {
        const pokemons = PokemonRepository.buscarPorTipo(tipo);
        if (pokemons.length === 0) {
            throw { status: 404, message: `Nenhum pokemon do tipo "${tipo}" encontrado` };
        }
        return pokemons;
    }

    static maisFortes() {
        const pokemons = PokemonRepository.maisFortes();
        if (pokemons.length === 0) {
            throw { status: 404, message: 'Nenhum pokemon cadastrado ainda' };
        }
        return pokemons;
    }

    static resumoEstatisticas() {
        return PokemonRepository.resumoEstatisticas();
    }

    static atualizar(id, dados) {
        const pokemonExiste = PokemonRepository.buscarPorId(id);
        if (!pokemonExiste) {
            throw { status: 404, message: 'Pokemon nao encontrado' };
        }

        PokemonRepository.atualizar(id, {
            name: dados.name || pokemonExiste.name,
            type: dados.type || pokemonExiste.type,
            hp: dados.hp || pokemonExiste.hp,
            attack: dados.attack || pokemonExiste.attack,
            defense: dados.defense || pokemonExiste.defense
        });

        return PokemonRepository.buscarPorId(id);
    }

    static atualizarParcial(id, campos) {
        const pokemonExiste = PokemonRepository.buscarPorId(id);
        if (!pokemonExiste) {
            throw { status: 404, message: 'Pokemon nao encontrado' };
        }

        const camposPermitidos = ['name', 'type', 'hp', 'attack', 'defense'];
        const camposValidos = {};

        for (const campo of camposPermitidos) {
            if (campos[campo] !== undefined) {
                camposValidos[campo] = campos[campo];
            }
        }

        if (Object.keys(camposValidos).length === 0) {
            throw { status: 400, message: 'Nenhum campo válido. Campos: name, type, hp, attack, defense' };
        }

        PokemonRepository.atualizarParcial(id, camposValidos);
        return PokemonRepository.buscarPorId(id);
    }

    static deletar(id) {
        const pokemon = PokemonRepository.buscarPorId(id);
        if (!pokemon) {
            throw { status: 404, message: 'Pokemon nao encontrado' };
        }

        PokemonRepository.deletar(id);
        return pokemon;
    }
}

module.exports = PokemonService;