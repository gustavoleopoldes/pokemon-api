

class PokemonView {
    static sucesso(res, dados, statusCode = 200) {
        return res.status(statusCode).json({
            status: 'sucesso',
            dados
        });
    }

    static criado(res, dados) {
        return res.status(201).json({
            status: 'sucesso',
            mensagem: 'Pokemon salvo com sucesso',
            pokemon: dados
        });
    }

    static lista(res, dados) {
        return res.status(200).json({
            status: 'sucesso',
            total: dados.length,
            pokemons: dados
        });
    }

    static estatisticas(res, dados) {
        return res.status(200).json({
            status: 'sucesso',
            estatisticas: dados
        });
    }

    static atualizado(res, dados) {
        return res.status(200).json({
            status: 'sucesso',
            mensagem: 'Pokemon atualizado!',
            pokemon: dados
        });
    }

    static deletado(res, dados) {
        return res.status(200).json({
            status: 'sucesso',
            mensagem: `${dados.name} foi removido com sucesso!`,
            pokemon: dados
        });
    }

    static importados(res, resultados) {
        const salvos = resultados.filter(r => r.salvo).length;
        return res.status(201).json({
            status: 'sucesso',
            mensagem: `${salvos} pokémon(s) importado(s) com sucesso`,
            total_enviados: resultados.length,
            total_salvos: salvos,
            detalhes: resultados
        });
    }

    static erro(res, mensagem, statusCode = 500) {
        return res.status(statusCode).json({
            status: 'erro',
            erro: mensagem
        });
    }

    static naoEncontrado(res, mensagem = 'Pokemon nao encontrado') {
        return res.status(404).json({
            status: 'erro',
            erro: mensagem
        });
    }

    static conflito(res, mensagem = 'Esse Pokemon ja esta salvo no banco') {
        return res.status(409).json({
            status: 'erro',
            erro: mensagem
        });
    }
}

module.exports = PokemonView;