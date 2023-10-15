<?php
/*
  Authors : initappz (Rahul Jograna)
  Website : https://initappz.com/
  App Name : Food Delivery Ionic 7 And Laravel
  This App Template Source code is licensed as per the
  terms found in the Website https://initappz.com/license
  Copyright and Good Faith Purchasers © 2023-present initappz.
*/
namespace App\Http\Controllers\v1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Otp;
use App\Models\User;
use App\Models\Drivers;
use App\Models\Settings;
use Carbon\Carbon;
use JWTAuth;
use DB;
use Validator;

class OtpController extends Controller
{
    public function verifyOTP(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'otp'=>'required'
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $match =  ['otp'=>$request->otp,'id'=>$request->id,'status'=>0];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $data->update(['status'=>1]);

        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyOTPReset(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'otp'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $match =  ['otp'=>$request->otp,'id'=>$request->id,'status'=>0];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $data->update(['status'=>1]);
        $token = '';

        $user = User::where('email',$request->email)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days

        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {

            return response()->json(['error' => 'invalid_credentials'], 401);

        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }



        $response = [
            'data'=>$data,
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyOTPWithMobileReset(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'otp'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $match =  ['otp'=>$request->otp,'id'=>$request->id,'status'=>0];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $data->update(['status'=>1]);
        $token = '';
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = User::where($matchThese)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days
        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $response = [
            'data'=>$data,
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getFirebaseToken(Request $request){
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $token = '';
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = User::where($matchThese)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days
        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $response = [
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getFirebaseTokenDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'country_code' => 'required',
            'mobile'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $token = '';
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = Drivers::where($matchThese)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days
        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $response = [
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyOTPResetDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'otp'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $match =  ['otp'=>$request->otp,'id'=>$request->id,'status'=>0];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $data->update(['status'=>1]);
        $token = '';

        $user = Drivers::where('email',$request->email)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days

        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {

            return response()->json(['error' => 'invalid_credentials'], 401);

        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }



        $response = [
            'data'=>$data,
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function verifyOTPWithMobileResetDriver(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'otp'=>'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $match =  ['otp'=>$request->otp,'id'=>$request->id,'status'=>0];
        $data = Otp::where($match)->first();
        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $data->update(['status'=>1]);
        $token = '';
        $matchThese = ['country_code' => $request->country_code, 'mobile' => $request->mobile];
        $user = Drivers::where($matchThese)->first();
        try {
            JWTAuth::factory()->setTTL(10); // Expired Time 28days
        if (! $token = JWTAuth::fromUser($user, ['exp' => Carbon::now()->addMinutes(5)->timestamp])) {
            return response()->json(['error' => 'invalid_credentials'], 401);
        }
        } catch (JWTException $e) {
            return response()->json(['error' => 'could_not_create_token'], 500);
        }

        $response = [
            'data'=>$data,
            'temp'=>$token,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }
}
