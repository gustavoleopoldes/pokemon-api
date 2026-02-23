

const db = require('../database/database.js');

class PokemonModel {
    static listarTodos() {
        return db.prepare('SELECT * FROM pokemons').all();
    }

    static buscarPorId(id) {
        return db.prepare('SELECT * FROM pokemons WHERE id = ?').get(id);
    }

    static buscarPorTipo(tipo) {
        return db.prepare(
            'SELECT * FROM pokemons WHERE type LIKE ?'
        ).all(`%${tipo}%`);
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
        const pokemonExiste = this.buscarPorId(id);
        if (!pokemonExiste) return null;

        const query = db.prepare(
            'UPDATE pokemons SET name = ?, type = ?, hp = ?, attack = ?, defense = ? WHERE id = ?'
        );
        query.run(
            dados.name || pokemonExiste.name,
            dados.type || pokemonExiste.type,
            dados.hp || pokemonExiste.hp,
            dados.attack || pokemonExiste.attack,
            dados.defense || pokemonExiste.defense,
            id
        );
        return this.buscarPorId(id);
    }

    static atualizarParcial(id, campos) {
        const pokemonExiste = this.buscarPorId(id);
        if (!pokemonExiste) return null;

        const camposPermitidos = ['name', 'type', 'hp', 'attack', 'defense'];
        const camposValidos = {};

        for (const campo of camposPermitidos) {
            if (campos[campo] !== undefined) {
                camposValidos[campo] = campos[campo];
            }
        }

        if (Object.keys(camposValidos).length === 0) return false;

        const setClause = Object.keys(camposValidos)
            .map(key => `${key} = ?`)
            .join(', ');
        const values = Object.values(camposValidos);

        db.prepare(`UPDATE pokemons SET ${setClause} WHERE id = ?`)
            .run(...values, id);

        return this.buscarPorId(id);
    }

        static deletar(id) {
        const pokemon = this.buscarPorId(id);
        if (!pokemon) return null;

        db.prepare('DELETE FROM pokemons WHERE id = ?').run(id);
        return pokemon;
    }
}

module.exports = PokemonModel;