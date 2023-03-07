import {
  Payment,
  SubscriptionPlan,
  SubscriptionPlanNameEnum,
} from "../../../generated/graphql";

export const getDefaultSubscriptionPlan = (subscriptionPlans: SubscriptionPlan[] = []) => {
  return subscriptionPlans.find(p => p.name === SubscriptionPlanNameEnum.Individual);
};

export const TODAY_DATE = new Date(new Date().setHours(0, 0, 0, 0));

export const findActivePaymentId = (payments: Payment[] = [], dateToCompare: Date) => {
  const dateTime = dateToCompare.getTime();
  return payments.find(({ expiredDate }) => new Date(expiredDate).getTime() > dateTime)?.id;
};

export const getActivePayment = (payments: Payment[] = [], activePaymentId: string) => {
  return payments.find(({ id }) => id === activePaymentId);
};

export const getPaymentsHistory = (payments: Payment[] = [], activePaymentId: string) => {
  return payments.filter(({ id }) => id !== activePaymentId);
};
