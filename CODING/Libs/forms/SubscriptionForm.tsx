import { Field, Form } from "react-final-form";
import { PaymentData, Payment } from "../../../../generated/graphql";
import { Grid } from "@material-ui/core";
import { DatePicker } from "@material-ui/pickers";
import { ButtonCustom, ModalInput } from "../../../shared/Style/Style";
import { validateForm, SubscriptionFormValues } from "./utils";

type CreatePaymentData = {
  data: Partial<PaymentData>;
};

interface SubscriptionFormProps {
  activePayment: Payment;
  disableSubmit: boolean;
  createPayment(variables: CreatePaymentData): void;
}

const formInitialValues: SubscriptionFormValues = {
  paymentDate: "",
  expiredDate: "",
  amount: "",
  price: "",
};

export const SubscriptionForm = ({
  activePayment,
  disableSubmit,
  createPayment
}: SubscriptionFormProps) => {
  const isDisabled = disableSubmit || !!activePayment?.id;
  const initialValues = activePayment || formInitialValues;

  const onFormValidation = (values: SubscriptionFormValues) => validateForm(values);

  const onFormSubmit = (values: SubscriptionFormValues) => {
    const { paymentDate, expiredDate, amount, price } = values;

    if (!amount || !price) return;
    else if (isNaN(Number(amount)) || isNaN(Number(price))) return;

    createPayment({
      data: {
        paymentDate,
        expiredDate,
        amount: +amount,
        price: +price,
      },
    });
  };

  return (
    <Form
      initialValues={initialValues}
      validate={onFormValidation}
      onSubmit={onFormSubmit}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          <Grid container justifyContent="center" spacing={2}>

            <Grid xs={6} item>
              <Field name="paymentDate">
                {({ input, meta }) => (
                  <DatePicker
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    fullWidth
                    variant="inline"
                    format="dd.MM.yyyy"
                    label="Дата платежа"
                    inputVariant="filled"
                    value={input.value || null}
                    onChange={input.onChange}
                  />
                )}
              </Field>
            </Grid>

            <Grid xs={6} item>
              <Field name="expiredDate">
                {({ input, meta }) => (
                  <DatePicker
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    fullWidth
                    variant="inline"
                    format="dd.MM.yyyy"
                    label="Дата окончания подписки"
                    inputVariant="filled"
                    value={input.value || null}
                    onChange={input.onChange}
                  />
                )}
              </Field>
            </Grid>

            <Grid xs={6} item>
              <Field name="amount">
                {({ input, meta }) => (
                  <ModalInput
                    label="Число подписок"
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    variant="filled"
                    type="text"
                    {...input}
                  />
                )}
              </Field>
            </Grid>

            <Grid xs={6} item>
              <Field name="price">
                {({ input, meta }) => (
                  <ModalInput
                    label="Цена за единицу"
                    error={meta.error && meta.touched}
                    helperText={meta.touched && meta.error}
                    variant="filled"
                    type="text"
                    {...input}
                  />
                )}
              </Field>
            </Grid>

            <Grid xs={12} item>
              <ButtonCustom
                type="submit"
                disabled={isDisabled}
              >
                Оформить подписку
              </ButtonCustom>
            </Grid>

          </Grid>
        </form>
      )}
    </Form>
  );
};
