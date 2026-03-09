

const PokemonView = require('../../src/views/pokemonView.js');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('PokemonView', () => {

    test('sucesso - deve retornar status 200 com dados', () => {
        const res = mockRes();
        const dados = { id: 1, name: 'pikachu' };

        PokemonView.sucesso(res, dados);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            dados
        });
    });

    test('criado - deve retornar status 201 com pokemon', () => {
        const res = mockRes();
        const dados = { id: 1, name: 'pikachu' };

        PokemonView.criado(res, dados);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            mensagem: 'Pokemon salvo com sucesso',
            pokemon: dados
        });
    });

    test('lista - deve retornar status 200 com array de pokemons', () => {
        const res = mockRes();
        const dados = [{ id: 1, name: 'pikachu' }, { id: 2, name: 'charmander' }];

        PokemonView.lista(res, dados);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            total: 2,
            pokemons: dados
        });
    });

    test('estatisticas - deve retornar status 200 com estatisticas', () => {
        const res = mockRes();
        const dados = { total: 10, media_hp: 50 };

        PokemonView.estatisticas(res, dados);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            estatisticas: dados
        });
    });

    test('atualizado - deve retornar status 200 com pokemon atualizado', () => {
        const res = mockRes();
        const dados = { id: 1, name: 'pikachu' };

        PokemonView.atualizado(res, dados);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            mensagem: 'Pokemon atualizado!',
            pokemon: dados
        });
    });

    test('deletado - deve retornar status 200 com mensagem de removido', () => {
        const res = mockRes();
        const dados = { id: 1, name: 'pikachu' };

        PokemonView.deletado(res, dados);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            mensagem: 'pikachu foi removido com sucesso!',
            pokemon: dados
        });
    });

    test('importados - deve retornar status 201 com resumo da importacao', () => {
        const res = mockRes();
        const resultados = [
            { name: 'pikachu', salvo: true },
            { name: 'invalido', salvo: false }
        ];

        PokemonView.importados(res, resultados);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            status: 'sucesso',
            mensagem: '1 pokémon(s) importado(s) com sucesso',
            total_enviados: 2,
            total_salvos: 1,
            detalhes: resultados
        });
    });

    test('erro - deve retornar status 500 por padrao', () => {
        const res = mockRes();

        PokemonView.erro(res, 'Erro interno');

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Erro interno'
        });
    });

    test('erro - deve retornar status customizado', () => {
        const res = mockRes();

        PokemonView.erro(res, 'Nao encontrado', 404);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Nao encontrado'
        });
    });

    test('naoEncontrado - deve retornar status 404 com mensagem padrao', () => {
        const res = mockRes();

        PokemonView.naoEncontrado(res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Pokemon nao encontrado'
        });
    });

    test('naoEncontrado - deve retornar status 404 com mensagem customizada', () => {
        const res = mockRes();

        PokemonView.naoEncontrado(res, 'Pikachu nao encontrado');

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Pikachu nao encontrado'
        });
    });

    test('conflito - deve retornar status 409 com mensagem padrao', () => {
        const res = mockRes();

        PokemonView.conflito(res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Esse Pokemon ja esta salvo no banco'
        });
    });

    test('conflito - deve retornar status 409 com mensagem customizada', () => {
        const res = mockRes();

        PokemonView.conflito(res, 'Pikachu ja existe!');

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({
            status: 'erro',
            erro: 'Pikachu ja existe!'
        });
    });
});

