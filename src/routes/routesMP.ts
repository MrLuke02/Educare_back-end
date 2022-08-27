import { Router } from "express";
import mp from "mercadopago";
import { CreatePaymentPayload } from "mercadopago/models/payment/create-payload.model";

const routerMP = Router();

// criando a rota de cadastro de Roles
routerMP.post("/pagamento", async (req, res) => {
  mp.configurations.setAccessToken(
    "APP_USR-5472035498375592-041320-4b65539db8fc5b6b4c8fe1197631bfe1-542257509"
  );

  var payment_data: CreatePaymentPayload = {
    transaction_amount: 0.01,
    description: "Título do produto",
    payment_method_id: "pix",
    payer: {
      email: "test@test.com",
      first_name: "Test",
      last_name: "User",
      identification: {
        type: "CPF",
        number: "19119119100",
      },
    },
    installments: 1,
    date_of_expiration: "2022-04-20T19:11:10.000-04:00",
  };

  const { response } = await mp.payment.create(payment_data);

  const {
    id,
    status,
    status_detail,
    transaction_details,
    point_of_interaction,
    transaction_data,
    date_of_expiration,
  } = response;

  return res.status(201).json({
    id,
    status,
    status_detail,
    transaction_details,
    point_of_interaction,
    transaction_data,
    date_of_expiration,
  });

  // return res.send(
  //   `<img src={"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAWCAYAAADeiIy1AAABwUlEQVRIS82UT4tBYRjFzzU30r13VjI2dnYmO4SFfAErFCt7C0uTmrthxUZ2IvkGdiJLiq3kzxdACVFzWQjTq6bGuP/GrWme9XPO7z2nt4e6XC4X/MFQ/xK0Xq8xmUxAP9Gwv9rBcZzqLlQlOh6PqNfr6PV6N8aBQADBYFAVTBWo2Wyi1WqJGoZCIfh8PkWYIuh0OoHneez3e1Ezy4sFqbeUdtB8Pkc+n5c1ymQyYFlWdkcx0eFwQDqdljQxGo3IZrPQ6XTaQERdrVYxHA5FjTweDyKRiPbqiMNms0GxWMRut7sxNJlMSCaTirURkWJ1X86kwn6/j9FoBIqi4HA44Ha7odfrFdP8CrRarbBcLiF8CFdjhmVgNptBUqkZ2UTn8xmdTgfdbhcEJDYE5Pf74fV6ZT+EJGi73aJSqWA2m6l5MGw2G+LxOBiGEd0XBQmCgEKhIJlCimy1WpFIJGAwGO5WREG1Wg2DwUBVkp9LUvfvDrRYLJDL5R6CEBFN0+DfeXDPt5f9DtRoNNButx8GEWE4HL5+ju9zByqXyxiPx5pALqcL0VhUHlQqlTCdTjWBnE4nYrGYPEgTQUas+gRpfcAnAt3evzEg/HcAAAAASUVORK5CYII="}  width="120px" height="120px"/>`
  // );
});

routerMP.get("/pagamento", async (req, res) => {
  mp.configurations.setAccessToken(
    "APP_USR-5472035498375592-041320-4b65539db8fc5b6b4c8fe1197631bfe1-542257509"
  );

  // const id = 21700723450;
  // const id = 21751571742;
  const id = 21753522830;

  const { response } = await mp.payment.findById(id);

  return res.status(200).json({ response });

  // var filters = {
  //   // payment_method_id: "pix",
  //   // installments: "1",
  //   // description: "Título do produto",
  //   operation_type: "regular_payment",
  // };

  // mp.payment
  //   .search({
  //     qs: filters,
  //   })
  //   .then(function (data) {
  //     res.send({
  //       result: data,
  //     });
  //   })
  //   .catch(function (error) {
  //     res.send({
  //       error: error,
  //     });
  //   });
});

routerMP.post("/payment", async (req, res) => {
  mp.configurations.setAccessToken(
    "TEST-5472035498375592-041320-74161da1d876815f6b2d4b0b74110455-542257509"
  );

  const {
    transaction_amount,
    token,
    description,
    installments,
    payment_method_id,
    email,
  } = req.body;

  var payment_data: CreatePaymentPayload = {
    transaction_amount,
    description,
    payment_method_id,
    payer: {
      email,
    },
    installments,
    token,
  };

  console.log(payment_data);

  const { status, response } = await mp.payment.save(payment_data);
  console.log(response);

  const { id, transaction_amountRes, date_approved, card } = response;
  const { first_six_digits, last_four_digits, cardholder } = card;

  return res.status(200).json({
    status,
    id,
    transaction_amountRes,
    date_approved,
    first_six_digits,
    last_four_digits,
    display_name: cardholder.name,
  });

  // var filters = {
  //   // payment_method_id: "pix",
  //   // installments: "1",
  //   // description: "Título do produto",
  //   operation_type: "regular_payment",
  // };

  // mp.payment
  //   .search({
  //     qs: filters,
  //   })
  //   .then(function (data) {
  //     res.send({
  //       result: data,
  //     });
  //   })
  //   .catch(function (error) {
  //     res.send({
  //       error: error,
  //     });
  //   });
});

routerMP.post("/hook", async (req, res) => {
  console.log(req.body);

  return res.send(req.body);
});

// exportando o router
export { routerMP };
