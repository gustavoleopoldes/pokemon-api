
Endpoints:

Método      	Endpoint	                         Descrição
GET	               /	                            Status da API
POST	        /pokemons	                Salvar pokémon (busca na PokeAPI)
POST	  /pokemons/importar-varios	            Importar vários pokémons
GET	            /pokemons	                        Listar todos
GET	           /pokemons/:id	                    Buscar por ID
GET	        /pokemons/tipo/:tipo	                Buscar por tipo
GET	        /pokemons/mais-fortes	               Top 5 mais fortes
GET	        /pokemons/stats/resumo	              Estatísticas gerais
PUT	           /pokemons/:id	                   Atualizar completo
PATCH	       /pokemons/:id	                 Atualizar parcialmente
DELETE	       /pokemons/:id	                    Deletar pokémon