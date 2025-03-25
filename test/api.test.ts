import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

describe("api", () => {
  test("should create a new passenger account", async () => {
    const input = {
      name: "john doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(
      `http://localhost:3000/accounts/${outputSignup.accountId}`
    );
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount).toEqual({
      account_id: outputSignup.accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      car_plate: null,
      is_passenger: true,
      is_driver: false,
      password: input.password,
    });
  });

  test("should not create a new passenger account with invalid name", async () => {
    const input = {
      name: "john",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid name");
  });

  test("should not create a new passenger account with invalid email", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid email");
  });

  test("should not create a new passenger account with invalid CPF", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "12934",
      isPassenger: true,
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid cpf");
  });

  test("should not create a new passenger when user already exists", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe@gmail.com`,
      cpf: "41121955088",
      isPassenger: true,
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Duplicated account");
  });

  test("should create a new driver account", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: false,
      isDriver: true,
      carPlate: "ABC1234",
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    const outputSignup = responseSignup.data;
    expect(outputSignup.accountId).toBeDefined();
    const responseGetAccount = await axios.get(
      `http://localhost:3000/accounts/${outputSignup.accountId}`
    );
    const outputGetAccount = responseGetAccount.data;
    expect(outputGetAccount).toEqual({
      account_id: outputSignup.accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      car_plate: "ABC1234",
      is_passenger: false,
      is_driver: true,
      password: input.password,
    });
  });

  test("should not create a new driver account with invalid car plate", async () => {
    const input = {
      name: "john Doe",
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "41121955088",
      isPassenger: false,
      isDriver: true,
      carPlate: "12883",
      password: "0293490239043",
    };

    const responseSignup = await axios.post(
      "http://localhost:3000/signup",
      input
    );
    expect(responseSignup.status).toBe(422);
    expect(responseSignup.data.message).toBe("Invalid car plate");
  });
});
