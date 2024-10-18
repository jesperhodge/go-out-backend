export declare class CreateGatherDto {
    gather: GatherWithoutId;
}
export declare class GatherWithoutId {
    name?: string;
    date?: string;
    googlePlace: GatherLocation;
    participants?: Participant[];
    description?: string;
    pictures?: string[];
}
export declare class JoinGatherDto {
    gatherId: number;
}
export declare class ListAllEntitiesDto {
    id?: number;
    name?: string;
    limit?: number;
    location?: string;
    date?: string;
    googleId?: string;
    address?: string;
    googlePlaceName?: string;
    bounds?: string;
}
export declare class Participant {
    id?: string;
    name: string;
}
export declare class GatherLocation {
    googleId?: string;
    location?: string;
    name?: string;
    formatted_address?: string;
    lat?: number;
    lng?: number;
}
export interface Gather {
    id?: string;
    name?: string;
    googlePlace: GatherLocation;
    participants: Participant[];
    description?: string;
    pictures?: string[];
}
