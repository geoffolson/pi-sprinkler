curl --header "Content-Type: application/json" \
  --request POST \
  --data '{ "gpioPin":6, "channel":"1" }' \
  http://localhost:3000/irrigation-pin