import API_BASE from '../config/api';

// Helper to fetch constituencies and transform them into locationData structure
export const fetchLocationData = async () => {
    try {
        const response = await fetch(`${API_BASE}/api/constituencies`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        // Transform flat list to hierarchy: State -> districts -> District -> [{name, number}]
        // Mocking 'number' as ID or random if not present, but better to use ID.
        // The original structure was:
        // { "StateName": { districts: { "DistrictName": [ { name, number } ] } } }

        const transformed = {};

        data.forEach(item => {
            const { state, district, name, id } = item;
            if (!state || !district) return; // Skip invalid

            if (!transformed[state]) {
                transformed[state] = { districts: {} };
            }
            if (!transformed[state].districts[district]) {
                transformed[state].districts[district] = [];
            }

            // Using ID for number as a fallback, or we could add a number field later.
            // For now, let's just use the ID as the number string.
            transformed[state].districts[district].push({
                name: name,
                number: id.toString()
            });
        });

        return transformed;
    } catch (error) {
        console.error("Error fetching location data:", error);
        return {};
    }
};
