# -*- encoding : utf-8 -*-
require 'test_helper'

class StudentsControllerTest < ActionController::TestCase
  setup do
    @request.env["HTTP_AUTHORIZATION"] = encode_credentials('klimatveckan', 'lintek')
  end

  test "should login with correct password" do
    post :api, {:liu_id => "johec890"}
    assert_response 200
  end

  test "should not login with wrong password" do
    @request.env["HTTP_AUTHORIZATION"] = encode_credentials('klimatveckan', '9999')
    post :api, {:liu_id => "johec890"}
    assert_response 401
  end

  test "should get parameter error" do
    post :api
    assert_response 400
    assert_equal "No parameter", @response.body
  end

  test "should find a student" do
    post :api, {:liu_id => "johec890"}
    assert_response 200
  end

  test "should not find student " do
    post :api, {:liu_id => "johec990"}
    assert_response 404
  end

  test "should find student with lintek membership" do
    post :api, {:liu_id => "johec890"}
    assert_equal "LinTek", @response.body
  end

  test "should find student with no membership" do
    post :api, {:liu_id => "nouni890"}
    assert_equal "", @response.body
  end
end
