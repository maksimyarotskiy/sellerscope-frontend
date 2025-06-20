export interface ProductSnapshot {
    id?: number; // ID из JpaRepository (Long в Java)
    productId: string; // article
    name: string;
    price: string; // BigDecimal в Java, в TS используем string для точности
    reviewCount: number;
    rating: number;
    photoHash: string;
    descriptionHash: string;
    createdAt: string; // LocalDateTime в Java, преобразуется в строку в JSON
    changedFields: string[]; // HashSet<String> в Java
    changed: boolean;
}