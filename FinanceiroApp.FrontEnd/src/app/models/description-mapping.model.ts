export interface DescriptionMapping {
    id: number;
    pattern: string;
    categoryId: number;
    categoryName: string;
}

export interface CreateDescriptionMappingDto {
    pattern: string;
    categoryId: number;
}

export interface UpdateDescriptionMappingDto extends CreateDescriptionMappingDto {
}
