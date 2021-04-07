<?php

namespace Apps\KanbanApi\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of the exception types that are not reported.
     *
     * @var array
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed for validation exceptions.
     *
     * @var array
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        if (app()->environment() === 'testing') {
            return;
        }
        // return parent::render($request, $e);
        // if ($request->ajax() || $request->wantsJson())
        // if ($request->wantsJson()) {
        // Define the response
        $response = [
            'errors' => 'Sorry, something went wrong.'
        ];

        // If the app is in debug mode
        if (config('app.debug')) {
            // Add the exception class name, message and stack trace to response
            $response['exception'] = get_class($e); // Reflection might be better here
            $response['message'] = $e->getMessage();
            $response['trace'] = $e->getTrace();
        }

        // Default response of 400
        $status = 400;

        // If this exception is an instance of HttpException
        if ($this->isHttpException($e)) {
            // Grab the HTTP status code from the Exception
            $status = $e->getStatusCode();
        }

        // Return a JSON response with the response array and status code
        return response()->json($response, $status);
        // }

        // Default to the parent class' implementation of handler
        // return parent::render($request, $e);
    }
}
