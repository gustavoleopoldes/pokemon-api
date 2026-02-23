
const express = require('express');
const pokemonRoutes = require('./routes/pokemonRoutes.js');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        mensagem: 'Pokemon API funcionando',
        endpoints: {
            'POST /pokemons': 'Salvar pokémon (busca na PokeAPI)',
            'POST /pokemons/importar-varios': 'Importar vários pokémons',
            'GET /pokemons': 'Listar todos',
            'GET /pokemons/:id': 'Buscar por ID',
            'GET /pokemons/tipo/:tipo': 'Buscar por tipo',
            'GET /pokemons/mais-fortes': 'Top 5 mais fortes',
            'GET /pokemons/stats/resumo': 'Estatísticas gerais',
            'PUT /pokemons/:id': 'Atualizar completo',
            'PATCH /pokemons/:id': 'Atualizar parcial',
            'DELETE /pokemons/:id': 'Deletar pokémon'
        }
    });
});

app.use(pokemonRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});