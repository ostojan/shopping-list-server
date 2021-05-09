export interface ValidationError {
    field: string;
    message: string;
}

export interface EntityValidator<Entity> {
    validateAllFields(entity: Entity): ValidationError[];
    validateSelectedFields(entity: Entity, fields: string[]): ValidationError[];
}
