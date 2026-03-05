

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

        PokemonService.listarTodos.mockImplementation(() => {
            throw erroFake;
        });

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
        const erroFake = { status: 404, message: 'Pokemon não encontrado' };

        PokemonService.buscarPorId.mockImplementation(() => {
            throw erroFake;
        });

        controller.buscarPorId(req, res);

        expect(PokemonView.erro).toHaveBeenCalledWith(res, erroFake.message, erroFake.status);
    });

    test('deletar - deve chamar Service e View corretamente', () => {

        const req = mockReq({ params: { id: 1 } });
        const res = mockRes();

        PokemonService.deletar.mockReturnValue({ deletado: true });

        controller.deletar(req, res);

        expect(PokemonService.deletar).toHaveBeenCalledWith(1);
    });

});