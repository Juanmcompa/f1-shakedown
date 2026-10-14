export class REA {
    constructor() {
        this.state = {};
        this.entities = new Set();
        this.systems = [];
    }

    // State Management
    setState(key, value) {
        this.state[key] = value;
        this.onStateChange(key, value);
    }

    getState(key) {
        return this.state[key];
    }

    onStateChange(key, value) {
        // Event emitter pattern for UI updates
        const event = new CustomEvent('rea-state-change', { detail: { key, value } });
        window.dispatchEvent(event);
    }

    // Entity Component System (ECS) Lite
    addEntity(entity) {
        this.entities.add(entity);
        return entity;
    }

    removeEntity(entity) {
        this.entities.delete(entity);
    }

    addSystem(system) {
        this.systems.push(system);
    }

    update(dt) {
        for (const system of this.systems) {
            system.update(this.entities, this.state, dt);
        }
    }
}

export const rea = new REA();
