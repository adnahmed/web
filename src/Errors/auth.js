// TODO: Make Errors for all Authentication Errors
class USER_NOT_FOUND_ERROR extends Error {
    init(user) {
        self.code = 300;
        self.message = `${user} not Found`;
    }
}