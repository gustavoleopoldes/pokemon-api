

const db = require('../database/database.js');

class PokemonRepository {
    static listarTodos() {
        return db.prepare('SELECT * FROM pokemons').all();
    }

    static buscarPorId(id) {
        return db.prepare('SELECT * FROM pokemons WHERE id = ?').get(id);
    }

    static buscarPorTipo(tipo) {
        return db.prepare(
            'SELECT * FROM pokemons WHERE type LIKE ?'
        ).all(`%${tipo}`);
    }

    static maisFortes() {
        return db.prepare(
            'SELECT * FROM pokemons ORDER BY attack DESC LIMIT 5'
        ).all();
    }

    static resumoEstatisticas() {
        return db.prepare(`
            SELECT
                COUNT(*) as total,
                ROUND(AVG(hp), 1) as media_hp,
                ROUND(AVG(attack), 1) as media_attack,
                ROUND(AVG(defense), 1) as media_defense,
                MAX(attack) as maior_ataque,
                MAX(defense) as maior_defesa,
                MAX(hp) as maior_hp
            FROM pokemons
        `).get();
    }

    static salvar(pokemon) {
        const query = db.prepare(
            'INSERT INTO pokemons (poke_id, name, type, hp, attack, defense, sprite) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        return query.run(
            pokemon.poke_id,
            pokemon.name,
            pokemon.type,
            pokemon.hp,
            pokemon.attack,
            pokemon.defense,
            pokemon.sprite
        );
    }

    static salvarVarios(pokemons) {
        const query = db.prepare(
            'INSERT OR IGNORE INTO pokemons (poke_id, name, type, hp, attack, defense, sprite) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );

        const inserirVarios = db.transaction((lista) => {
            const resultados = [];
            for (const pokemon of lista) {
                try {
                    const resultado = query.run(
                        pokemon.poke_id,
                        pokemon.name,
                        pokemon.type,
                        pokemon.hp,
                        pokemon.attack,
                        pokemon.defense,
                        pokemon.sprite
                    );
                    resultados.push({
                        name: pokemon.name,
                        salvo: resultado.changes > 0
                    });
                } catch (erro) {
                    resultados.push({
                        name: pokemon.name,
                        salvo: false,
                        erro: 'Já existe no banco'
                    });
                }
            }
            return resultados;
        });

        return inserirVarios(pokemons);
    }

    static atualizar(id, dados) {
        const query = db.prepare(
            'UPDATE pokemons SET name = ?, type = ?, hp = ?, attack = ?, defense = ? WHERE id = ?'
        );
        return query.run(dados.name, dados.type, dados.hp, dados.attack, dados.defense, id);
        }

        static atualizarParcial(id, campos) {
            const setClause = Object.keys(campos)
                .map(key => `${key} = ?`)
                .join(', ');
            const values = Object.values(campos);
            
            return db.prepare(`UPDATE pokemons SET ${setClause} WHERE id = ?`)
                .run(...values, id);
        }

    static deletar(id) {
        return db.prepare('DELETE FROM pokemons WHERE id = ?').run(id);
    }
}

module.exports = PokemonRepository;