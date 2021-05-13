export interface GenericDataSource<Entity> {
    findById(id: any): Promise<Entity | undefined>;
    find(params: Partial<Entity>): Promise<Entity[]>;
    insert(body: Partial<Entity>): Promise<Entity>;
    remove(entity: Entity): Promise<Entity>;
    update(entity: Entity): Promise<Entity>;
}
