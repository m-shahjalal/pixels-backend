import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../modules/users/entities/user.entity';

export const UserFactory = setSeederFactory(User, (faker) => {
  const user = new User();
  user.email = faker.internet.email();
  user.phone = faker.phone.number();
  user.password = faker.internet.password();
  user.firstName = faker.person.firstName();
  user.lastName = faker.person.lastName();
  user.username = faker.internet.userName();
  user.avatar = faker.image.avatar();
  user.isVerified = faker.datatype.boolean();
  user.isEmailVerified = faker.datatype.boolean();
  user.isPhoneVerified = faker.datatype.boolean();

  return user;
});
