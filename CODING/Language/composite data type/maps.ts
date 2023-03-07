import { DocumentNode } from "@apollo/client";
import {
  CreatePaymentFormAdminPanelDocument,
  GetPaymentsHistoryBySchoolDocument,
  GetSubscriptionPlansDocument,
  HandlePaymentActivationDocument,
  DeletePaymentDocument,
} from "../../../generated/graphql";

export enum SchoolPaymentsEnum {
  subscriptionPlans = "subscriptionPlans",
  paymentsHistory = "paymentsHistory",
  createPayment = "createPayment",
  activatePayment = "activatePayment",
  deletePayment = "deletePayment",
};

export const DocumentsMap = new Map<SchoolPaymentsEnum, DocumentNode>([
  [SchoolPaymentsEnum.subscriptionPlans, GetSubscriptionPlansDocument],
  [SchoolPaymentsEnum.paymentsHistory, GetPaymentsHistoryBySchoolDocument],
  [SchoolPaymentsEnum.createPayment, CreatePaymentFormAdminPanelDocument],
  [SchoolPaymentsEnum.activatePayment, HandlePaymentActivationDocument],
  [SchoolPaymentsEnum.deletePayment, DeletePaymentDocument],
]);

export const CustomErrorMessagesMap = new Map<SchoolPaymentsEnum, string>([
  [SchoolPaymentsEnum.subscriptionPlans, "Ошибка получения планов подписки"],
  [SchoolPaymentsEnum.paymentsHistory, "Ошибка получения истории платежей"],
  [SchoolPaymentsEnum.createPayment, "Ошибка создания платежа"],
  [SchoolPaymentsEnum.activatePayment, "Ошибка активации платежа"],
  [SchoolPaymentsEnum.deletePayment, "Ошибка удаления платежа"],
]);

export const GqlErrorMessagesMap = new Map<string, string>([
  ["You are not permitted for this action", "У вас нет прав на выполнение данного действия"],
]);
