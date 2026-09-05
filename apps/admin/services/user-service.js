import tokenBearer from "@/lib/bearer-token";

const baseURL = "http://localhost:8080";


const userService = {
    async getUserById(id) {
        try {
            const res = await tokenBearer.get(`${baseURL}/users/${id}`, {
                withCredentials: true,
            });
            return res.data.data;
        } catch (e) {
            const message = e.response?.data?.message || 'Failed to fetch user';
            throw new Error(message);
        }
    },

    async postUser(request) {
        try {
            const post = await tokenBearer.post(`${baseURL}/users`, {
                name: request.name,
                password: request.password,
                email: request.email,
                roles: request.roles,
            }, { withCredentials: true })

            return post.data.data;

        } catch (e) {
            const message = e.response?.data?.message || 'create failed';
            throw new Error(message);
        }
    },

    async patchUser(id, request) {
        try {
            const payload = {
                name: request.name,
                email: request.email,
                roles: Array.isArray(request.roles)
                    ? request.roles.map(r => (typeof r === 'object' && r !== null ? r.name : r)).filter(Boolean)
                    : request.roles,
            };
            if (request.password && String(request.password).trim() !== '') {
                payload.passwordHash = request.password;
            }

            const res = await tokenBearer.patch(
                `${baseURL}/users/${id}`,
                payload
            );

            return res.data.data;
        } catch (e) {
            const message =
                e.response?.data?.message || 'Update user failed';
            throw new Error(message);
        }
    },

    async deleteUser(id) {
        try {
            const res = await tokenBearer.delete(
                `${baseURL}/users/${id}`
            );

            return res.data.data;
        } catch (e) {
            const message =
                e.response?.data?.message || "Delete user failed";
            throw new Error(message);
        }
    }
}
export default userService;