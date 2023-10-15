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
use App\Models\Settings;
use App\Models\Popup;
use App\Models\Manage;
use App\Models\General;
use App\Models\Language;
use Validator;
use DB;

class SettingsController extends Controller
{
    public function save(Request $request){
        $validator = Validator::make($request->all(), [
            'currencySymbol' => 'required',
            'currencySide' => 'required',
            'appDirection' => 'required',
            'logo' => 'required',
            'sms_name' => 'required',
            'sms_creds' => 'required',
            'delivery' => 'required',
            'home_ui' => 'required',
            'reset_pwd' => 'required',
            'user_login' => 'required',
            'store_login' => 'required',
            'driver_login' => 'required',
            'web_login' => 'required',
            'driver_assignments' => 'required',
            'fcm_token' => 'required',
            'default_country_code' => 'required',
            'country_modal' => 'required',
            'allowDistance' => 'required',
            'searchResultKind' => 'required',
            'search_radius' => 'required',
            'user_verify_with' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }

        $data = Settings::create($request->all());
        if (is_null($data)) {
            $response = [
            'data'=>$data,
            'message' => 'error',
            'status' => 500,
        ];
        return response()->json($response, 200);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function getDefault(){
        $data = DB::table('settings')->select('settings.*')->first();
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function update(Request $request){
        $validator = Validator::make($request->all(), [
            'id' => 'required',
        ]);
        if ($validator->fails()) {
            $response = [
                'success' => false,
                'message' => 'Validation Error.', $validator->errors(),
                'status'=> 500
            ];
            return response()->json($response, 404);
        }
        $data = Settings::find($request->id)->update($request->all());

        if (is_null($data)) {
            $response = [
                'success' => false,
                'message' => 'Data not found.',
                'status' => 404
            ];
            return response()->json($response, 404);
        }
        $response = [
            'data'=>$data,
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }

    public function appSettingsDefault(Request $request){
        if (is_null($request->id) || $request->id == null || $request->id == 'null') {
            $response = [
                'settings'=>Settings::first(),
                'popup'=>Popup::first(),
                'manage'=>Manage::first(),
                'general'=>General::first(),
                'languages'=>Language::where('status',1)->get(),
                'translation'=>DB::table('lang')->where('is_default',1)->first(),
                'success' => true,
                'status' => 200,
            ];
            return response()->json($response, 200);
        }
        $response = [
            'settings'=>Settings::first(),
            'popup'=>Popup::first(),
            'manage'=>Manage::first(),
            'general'=>General::first(),
            'languages'=>Language::where('status',1)->get(),
            'translation'=>DB::table('lang')->where('id',$request->id)->first(),
            'success' => true,
            'status' => 200,
        ];
        return response()->json($response, 200);
    }
}
