
const express = require('express');
const router = express.Router();
const controller = require('../controllers/pokemonController.js');

router.get('/pokemons/tipo/:tipo', controller.buscarPorTipo);
router.get('/pokemons/mais-fortes', controller.maisFortes);
router.get('/pokemons/stats/resumo', controller.resumoEstatisticas);
router.post('/pokemons/importar-varios', controller.importarVarios);  

router.post('/pokemons', controller.salvar);
router.get('/pokemons', controller.listarTodos);
router.get('/pokemons/:id', controller.buscarPorId);
router.put('/pokemons/:id', controller.atualizar);
router.patch('/pokemons/:id', controller.atualizarParcial);
router.delete('/pokemons/:id', controller.deletar);

module.exports = router;