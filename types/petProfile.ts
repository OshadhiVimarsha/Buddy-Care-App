export interface PetProfile {
    id?: string; // Unique identifier for the pet (optional, for database/storage)
    name: string; // Pet's name (e.g., "Browny")
    photo?: string; // URL or file path for pet's photo (optional)
    age?: number; // Pet's age in years or months (optional)
    birthDate?: string; // Pet's birthday (ISO format, e.g., "2023-05-10")
    breed?: string; // Pet's breed (e.g., "Labrador", "Persian")
    adoptionDate?: string; // Adoption date (ISO format, e.g., "2024-01-15")
    birthdayNotes?: string; // Notes for birthday celebrations or gift ideas
    healthInfo?: {
        allergies?: string[]; // List of allergies (e.g., ["Peanuts", "Dust"])
        conditions?: string[]; // Common conditions (e.g., ["Ear infection"])
        weightHistory: Array<{
            date: string; // Date of weight record (ISO format, e.g., "2025-09-01")
            weight: number; // Weight in kg (e.g., 10.5)
        }>;
    };
    vetVisits?: Array<{
        date: string; // Date of vet visit (ISO format, e.g., "2025-08-10")
        reason: string; // Reason for visit (e.g., "Vaccination", "Checkup")
        notes?: string; // Additional notes (e.g., "Dr. Silva, Rabies vaccine")
        clinicInfo?: {
            clinicName: string; // Clinic name (e.g., "Happy Paws")
            address?: string; // Clinic address
            phone?: string; // Clinic phone number
            doctorName?: string; // Vet's name
        };
    }>;
    trainingLog?: Array<{
        task: string; // Training task (e.g., "Sit", "Stay")
        date: string; // Date of training (ISO format)
        progress: number; // Progress percentage (e.g., 80)
        notes?: string; // Additional notes (e.g., "Mastered Sit command")
    }>;
    reminders?: Array<{
        type: "Vaccination" | "Food" | "Medicine" | "Event"; // Reminder type
        date: string; // Reminder date (ISO format)
        description: string; // Description (e.g., "Rabies vaccination due")
        repeat?: "Daily" | "Weekly" | "Monthly" | "Yearly"; // Optional repeat frequency
    }>;
}