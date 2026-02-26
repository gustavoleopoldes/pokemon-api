

class Pokemon {
    constructor({ id, poke_id, name, type, hp, attack, defense, sprite }) {
        this.id = id || null;
        this.poke_id = poke_id;
        this.name = name;
        this.type = type;
        this.hp = hp;
        this.attack = attack;
        this.defense = defense;
        this.sprite = sprite;
}
isValid() {
    if (!this.name || !this.type) {
        return { valid: false, message: 'Nome e tipo são obrigatórios' };
    }
    return {valid: true };
    }
}

module.exports = Pokemon;