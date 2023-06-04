import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function NoNotificationTimeIfNotAllowed(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'noNotificationTimeIfNotAllowed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const allowNotification = (args.object as any).allowNotification;
          return allowNotification || value === undefined;
        },
        defaultMessage(args: ValidationArguments) {
          return `Notification time should not be provided when allowNotification is false.`;
        },
      },
    });
  };
}
