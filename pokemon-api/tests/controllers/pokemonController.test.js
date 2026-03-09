

const controller = require('../../src/controllers/pokemonController.js');
const PokemonService = require('../../src/services/pokemonService.js');
const PokemonView = require('../../src/views/pokemonView.js');

jest.mock('../../src/services/pokemonService.js');
jest.mock('../../src/views/pokemonView.js');

const mockReq = (dados = {}) => ({
    body: dados.body || {},
    params: dados.params || {},
});

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('pokemonController', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('salvar - deve chamar Service e View corretamente', async () => {
        const req = mockReq({ body: { name: 'pikachu' } });
        const res = mockRes();
        const pokemonFake = { id: 1, name: 'pikachu' };

        PokemonService.salvar.mockResolvedValue(pokemonFake);

        await controller.salvar(req, res);

        expect(PokemonService.salvar).toHaveBeenCalledWith('pikachu');
        expect(PokemonView.criado).toHaveBeenCalledWith(res, pokemonFake);
    });

    test('salvar - deve chamar View.erro quando Service lançar erro', async () => {
        const req = mockReq({ body: { name: 'pikachu' } });
        const res = mockRes();
        const erroFake = { status: 400, message: 'Envie o campo "name"' };

        PokemonService.salvar.mockRejectedValue(erroFake);

        await controller.salvar(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('importarVarios - deve chamar Service e View corretamente', async () => {
        const req = mockReq({ body: { nomes: ['pikachu', 'charmander'] } });
        const res = mockRes();
        const fakeResultados = [{ name: 'pikachu', salvo: true }];

        PokemonService.importarVarios.mockResolvedValue(fakeResultados);

        await controller.importarVarios(req, res);

        expect(PokemonService.importarVarios).toHaveBeenCalledWith(['pikachu', 'charmander']);
        expect(PokemonView.importados).toHaveBeenCalledWith(res, fakeResultados);
    });

    test('importarVarios - deve chamar View.erro quando Service lançar erro', async () => {
        const req = mockReq({ body: { nomes: [] } });
        const res = mockRes();
        const erroFake = { status: 400, message: 'Envie um array "nomes"' };

        PokemonService.importarVarios.mockRejectedValue(erroFake);

        await controller.importarVarios(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('listarTodos - deve chamar Service e View corretamente', () => {
        const req = mockReq();
        const res = mockRes();
        const pokemonsFake = [{ id: 1, name: 'pikachu' }];

        PokemonService.listarTodos.mockReturnValue(pokemonsFake);

        controller.listarTodos(req, res);

        expect(PokemonService.listarTodos).toHaveBeenCalledTimes(1);
        expect(PokemonView.lista).toHaveBeenCalledWith(res, pokemonsFake);
    });

    test('listarTodos - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq();
        const res = mockRes();
        const erroFake = { status: 500, message: 'Erro interno' };

        PokemonService.listarTodos.mockImplementation(() => { throw erroFake; });

        controller.listarTodos(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('buscarPorId - deve chamar Service e View corretamente', () => {
        const req = mockReq({ params: { id: 1 } });
        const res = mockRes();
        const pokemonFake = { id: 1, name: 'pikachu' };

        PokemonService.buscarPorId.mockReturnValue(pokemonFake);

        controller.buscarPorId(req, res);

        expect(PokemonService.buscarPorId).toHaveBeenCalledWith(1);
        expect(PokemonView.sucesso).toHaveBeenCalledWith(res, pokemonFake);
    });

    test('buscarPorId - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq({ params: { id: 999 } });
        const res = mockRes();
        const erroFake = { status: 404, message: 'Pokemon nao encontrado' };

        PokemonService.buscarPorId.mockImplementation(() => { throw erroFake; });

        controller.buscarPorId(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('buscarPorTipo - deve chamar Service e View corretamente', () => {
        const req = mockReq({ params: { tipo: 'electric' } });
        const res = mockRes();
        const fakeLista = [{ id: 1, name: 'pikachu' }];

        PokemonService.buscarPorTipo.mockReturnValue(fakeLista);

        controller.buscarPorTipo(req, res);

        expect(PokemonService.buscarPorTipo).toHaveBeenCalledWith('electric');
        expect(PokemonView.lista).toHaveBeenCalledWith(res, fakeLista);
    });

    test('buscarPorTipo - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq({ params: { tipo: 'invalido' } });
        const res = mockRes();
        const erroFake = { status: 404, message: 'Nenhum pokemon encontrado' };

        PokemonService.buscarPorTipo.mockImplementation(() => { throw erroFake; });

        controller.buscarPorTipo(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('maisFortes - deve chamar Service e View corretamente', () => {
        const req = mockReq();
        const res = mockRes();
        const fakeLista = [{ id: 1, name: 'dragonite' }];

        PokemonService.maisFortes.mockReturnValue(fakeLista);

        controller.maisFortes(req, res);

        expect(PokemonService.maisFortes).toHaveBeenCalledTimes(1);
        expect(PokemonView.lista).toHaveBeenCalledWith(res, fakeLista);
    });

    test('maisFortes - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq();
        const res = mockRes();
        const erroFake = { status: 404, message: 'Nenhum pokemon cadastrado' };

        PokemonService.maisFortes.mockImplementation(() => { throw erroFake; });

        controller.maisFortes(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('resumoEstatisticas - deve chamar Service e View corretamente', () => {
        const req = mockReq();
        const res = mockRes();
        const fakeStats = { total: 10 };

        PokemonService.resumoEstatisticas.mockReturnValue(fakeStats);

        controller.resumoEstatisticas(req, res);

        expect(PokemonService.resumoEstatisticas).toHaveBeenCalledTimes(1);
        expect(PokemonView.estatisticas).toHaveBeenCalledWith(res, fakeStats);
    });

    test('resumoEstatisticas - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq();
        const res = mockRes();
        const erroFake = { status: 500, message: 'Erro interno' };

        PokemonService.resumoEstatisticas.mockImplementation(() => { throw erroFake; });

        controller.resumoEstatisticas(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('atualizar - deve chamar Service e View corretamente', () => {
        const req = mockReq({ params: { id: 1 }, body: { name: 'raichu' } });
        const res = mockRes();
        const fakePokemon = { id: 1, name: 'raichu' };

        PokemonService.atualizar.mockReturnValue(fakePokemon);

        controller.atualizar(req, res);

        expect(PokemonService.atualizar).toHaveBeenCalledWith(1, { name: 'raichu' });
        expect(PokemonView.atualizado).toHaveBeenCalledWith(res, fakePokemon);
    });

    test('atualizar - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq({ params: { id: 999 }, body: {} });
        const res = mockRes();
        const erroFake = { status: 404, message: 'Pokemon nao encontrado' };

        PokemonService.atualizar.mockImplementation(() => { throw erroFake; });

        controller.atualizar(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('atualizarParcial - deve chamar Service e View corretamente', () => {
        const req = mockReq({ params: { id: 1 }, body: { hp: 100 } });
        const res = mockRes();
        const fakePokemon = { id: 1, hp: 100 };

        PokemonService.atualizarParcial.mockReturnValue(fakePokemon);

        controller.atualizarParcial(req, res);

        expect(PokemonService.atualizarParcial).toHaveBeenCalledWith(1, { hp: 100 });
        expect(PokemonView.atualizado).toHaveBeenCalledWith(res, fakePokemon);
    });

    test('atualizarParcial - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq({ params: { id: 1 }, body: { campoInvalido: 'x' } });
        const res = mockRes();
        const erroFake = { status: 400, message: 'Nenhum campo valido' };

        PokemonService.atualizarParcial.mockImplementation(() => { throw erroFake; });

        controller.atualizarParcial(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('deletar - deve chamar Service e View corretamente', () => {
        const req = mockReq({ params: { id: 1 } });
        const res = mockRes();
        const fakePokemon = { id: 1, name: 'pikachu' };

        PokemonService.deletar.mockReturnValue(fakePokemon);

        controller.deletar(req, res);

        expect(PokemonService.deletar).toHaveBeenCalledWith(1);
        expect(PokemonView.deletado).toHaveBeenCalledWith(res, fakePokemon);
    });

    test('deletar - deve chamar View.erro quando Service lançar erro', () => {
        const req = mockReq({ params: { id: 999 } });
        const res = mockRes();
        const erroFake = { status: 404, message: 'Pokemon nao encontrado' };

        PokemonService.deletar.mockImplementation(() => { throw erroFake; });

        controller.deletar(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });
});