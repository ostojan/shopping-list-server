import { getConnection } from "typeorm";
import { User } from "../../../src/entities/User";

export const validId = 1;
export const emptyUsername = "";
export const tooShortUsername = "U";
export const tooLongUsername =
    "Lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-Nullam-venenatis-odio-turpis-eu-vehicula-nisl-euismod-nec-Praesent-fermentum-erat-ligula-eu-convallis-elit-aliquet-id-Sed-mi-nisl-ullamcorper-vitae-tellus-nec-scelerisque-mollis-sapien-Integer-nulla-dui";
export const validUsername = "Username1";
export const anotherValidUsername = "Username2";
export const invalidUsername = "U";

export const empytEmail = "";
export const notAnEmail = "This is not an email";
export const tooLongEmail =
    "Lorem-ipsum-dolor-sit-amet-consectetur-adipiscing-elit-Nullam-venenatis-odio-turpis-eu-vehicula-nisl-euismod-nec-Praesent-fermentum@erat-ligula-eu-convallis-elit-aliquet-id-Sed-mi-nisl-ullamcorper-vitae-tellus-nec-scelerisque-mollis-sapien-Integer-nulla.com";
export const validEmail = "user1@example.com";
export const anotherValidEmail = "user2@example.com";
export const invalidEmail = "This is not an email";

export const emptyPassword = "";
export const tooShortPassword = "LXds&9!";
export const tooLongPassword = "bEuDajn5rY6vvEVtGRmoqiT9tT#CLM4Sa";
export const passwordWithoutLowercase = "@$X9WGQZQ*6CX3W5";
export const passwordWithoutUppercase = "umgd@qj4bz*nppka";
export const passwordWithoutNumber = "hjf&inRQJGwQ!$sF";
export const passwordWithoutSpecialCharacter = "ybiKArGTo2J2teea";
export const validPassword = "cGW&%Rnjjq3E4KJ9";
export const anotherValidPassword = "#48Vzn3fZoTua3&@";
export const invalidPassword = "VQVNHBFDUMZJJTMP";

export const createValidUser = (): User => {
    const user = new User();
    user.id = 1;
    user.username = validUsername;
    user.email = validEmail;
    user.password = validPassword;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
};

export const createInvalidUser = (): User => {
    const user = new User();
    user.id = 1;
    user.username = invalidUsername;
    user.email = invalidEmail;
    user.password = invalidPassword;
    user.createdAt = new Date();
    user.updatedAt = new Date();
    return user;
};

export const saveValidUser = async (): Promise<User> => {
    const userRepository = getConnection().getRepository(User);
    return await userRepository.save(createValidUser());
};
