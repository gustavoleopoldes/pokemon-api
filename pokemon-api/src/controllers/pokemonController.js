
const PokemonModel = require('../models/pokemonModel.js');
const PokemonView = require('../views/pokemonView.js');
const { buscarPokemonNaApi, buscarVariosPokemonsNaApi } = require('../services/pokeApiService.js');

async function salvar(req, res) {
    try {
        const { name } = req.body;

        if (!name) {
            return PokemonView.erro(res, 'Envie o campo "name"', 400);
        }

        const pokemon = await buscarPokemonNaApi(name);
        const resultado = PokemonModel.salvar(pokemon);

        return PokemonView.criado(res, { id: resultado.lastInsertRowid, ...pokemon });
    } catch (erro) {
        if (erro.response && erro.response.status === 404) {
            return PokemonView.naoEncontrado(res, 'Pokemon nao encontrado na PokeAPI');
        }
        if (erro.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return PokemonView.conflito(res);
        }
        console.error(erro);
        return PokemonView.erro(res, 'Erro interno do servidor');
    }
}

async function importarVarios(req, res) {
    try {
        const { nomes } = req.body;

        if (!nomes || !Array.isArray(nomes) || nomes.length === 0) {
            return PokemonView.erro(res, 'Envie um array "nomes" com os nomes dos pokémons', 400);
        }

        if (nomes.length > 20) {
            return PokemonView.erro(res, 'Máximo de 20 pokémons por vez', 400);
        }

        const { sucesso, falhas } = await buscarVariosPokemonsNaApi(nomes);
        const resultados = PokemonModel.salvarVarios(sucesso);

        const todosResultados = [
            ...resultados,
            ...falhas.map(f => ({ name: f.nome, salvo: false, erro: f.erro }))
        ];

        return PokemonView.importados(res, todosResultados);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao importar pokémons');
    }
}

function listarTodos(req, res) {
    try {
        const pokemons = PokemonModel.listarTodos();
        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao buscar pokemons');
    }
}

function buscarPorId(req, res) {
    try {
        const { id } = req.params;
        const pokemon = PokemonModel.buscarPorId(id);

        if (!pokemon) {
            return PokemonView.naoEncontrado(res);
        }

        return PokemonView.sucesso(res, pokemon);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao buscar pokemon');
    }
}

function buscarPorTipo(req, res) {
    try {
        const { tipo } = req.params;
        const pokemons = PokemonModel.buscarPorTipo(tipo);

        if (pokemons.length === 0) {
            return PokemonView.naoEncontrado(res, `Nenhum pokemon do tipo "${tipo}" encontrado`);
        }

        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao buscar pokemons por tipo');
    }
}

function maisFortes(req, res) {
    try {
        const pokemons = PokemonModel.maisFortes();

        if (pokemons.length === 0) {
            return PokemonView.naoEncontrado(res, 'Nenhum pokemon cadastrado ainda');
        }

        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao buscar pokemons mais fortes');
    }
}

function resumoEstatisticas(req, res) {
    try {
        const stats = PokemonModel.resumoEstatisticas();
        return PokemonView.estatisticas(res, stats);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao buscar estatísticas');
    }
}

function atualizar(req, res) {
    try {
        const { id } = req.params;
        const pokemon = PokemonModel.atualizar(id, req.body);

        if (!pokemon) {
            return PokemonView.naoEncontrado(res);
        }

        return PokemonView.atualizado(res, pokemon);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao atualizar pokemon');
    }
}

function atualizarParcial(req, res) {
    try {
        const { id } = req.params;
        const resultado = PokemonModel.atualizarParcial(id, req.body);

        if (resultado === null) {
            return PokemonView.naoEncontrado(res);
        }

        if (resultado === false) {
            return PokemonView.erro(res, 'Nenhum campo válido para atualizar. Campos: name, type, hp, attack, defense', 400);
        }

        return PokemonView.atualizado(res, resultado);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao atualizar pokemon');
    }
}

function deletar(req, res) {
    try {
        const { id } = req.params;
        const pokemon = PokemonModel.deletar(id);

        if (!pokemon) {
            return PokemonView.naoEncontrado(res);
        }

        return PokemonView.deletado(res, pokemon);
    } catch (erro) {
        console.error(erro);
        return PokemonView.erro(res, 'Erro ao deletar pokemon');
    }
}

module.exports = {
    salvar,
    importarVarios,
    listarTodos,
    buscarPorId,
    buscarPorTipo,
    maisFortes,
    resumoEstatisticas,
    atualizar,
    atualizarParcial,
    deletar
};