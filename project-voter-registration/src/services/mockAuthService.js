export const mockAuthService = {
    login: async (phone, password) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        try {
            const users = JSON.parse(localStorage.getItem('registered_users') || '{}');
            const user = users[phone];

            if (!user) {
                return { success: false, error: 'User not found. Please register.' };
            }

            if (user.password !== password) {
                return { success: false, error: 'Invalid password.' };
            }

            return { success: true, user: { phone, name: user.name } };
        } catch (error) {
            return { success: false, error: 'Login failed.' };
        }
    },

    register: async (fullName, phone, password) => {
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        try {
            const users = JSON.parse(localStorage.getItem('registered_users') || '{}');

            if (users[phone]) {
                return { success: false, error: 'User already exists. Please login.' };
            }

            users[phone] = {
                name: fullName,
                password,
                createdAt: new Date().toISOString()
            };

            localStorage.setItem('registered_users', JSON.stringify(users));
            return { success: true, user: { phone, name: fullName } };
        } catch (error) {
            return { success: false, error: 'Registration failed.' };
        }
    }
};
