
const PokemonService = require('../services/pokemonService.js');
const PokemonView = require('../views/pokemonView.js');
const { buscarPokemonNaApi, buscarVariosPokemonsNaApi } = require('../services/pokeApiService.js');

async function salvar(req, res) {
    try {
        const pokemon = await PokemonService.salvar(req.body.name);
        return PokemonView.criado(res, pokemon);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

async function importarVarios(req, res) {
    try {
        const resultados = await PokemonService.importarVarios(req.body.nomes);
        return PokemonView.importados(res, resultados);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function listarTodos(req, res) {
    try {
        const pokemons = PokemonService.listarTodos();
        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function buscarPorId(req, res) {
    try {
        const pokemon = PokemonService.buscarPorId(req.params.id);
        return PokemonView.sucesso(res, pokemon);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function buscarPorTipo(req, res) {
    try {
        const pokemons = PokemonService.buscarPorTipo(req.params.tipo);
        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function maisFortes(req, res) {
    try {
        const pokemons = PokemonService.maisFortes();
        return PokemonView.lista(res, pokemons);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function resumoEstatisticas(req, res) {
    try {
        const stats = PokemonService.resumoEstatisticas();
        return PokemonView.estatisticas(res, stats);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function atualizar(req, res) {
    try {
        const pokemon = PokemonService.atualizar(req.params.id, req.body);
        return PokemonView.atualizado(res, pokemon);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function atualizarParcial(req, res) {
    try {
        const pokemon = PokemonService.atualizarParcial(req.params.id, req.body);
        return PokemonView.atualizado(res, pokemon);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
    }
}

function deletar(req, res) {
    try {
        const pokemon = PokemonService.deletar(req.params.id);
        return PokemonView.deletado(res, pokemon);
    } catch (erro) {
        return PokemonView.erro(res, erro.message, erro.status);
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