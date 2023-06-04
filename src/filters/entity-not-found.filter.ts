import { Catch, ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 404;

    // Extract the entity name from the error message
    const errorMessage = exception.message;
    // Extract entity name using regex.
    const entityMatch = errorMessage.match(/\"(.*?)\"/);
    const entityName = entityMatch ? entityMatch[1] : '';

    // Extract criteria using regex
    const criteriaMatch = errorMessage.match(/\{([^}]+)\}/);
    const criteriaStr = criteriaMatch ? criteriaMatch[1] : '';
    const criteriaKey = criteriaStr
      .split(':')
      .map((str) => str.trim().replace(/\"/g, ''))[0];

    response.status(status).json({
      statusCode: status,
      message: `${entityName} with given ${criteriaKey} doesn't exist`,
      error: `EntityNotFound`,
    });
  }
}
