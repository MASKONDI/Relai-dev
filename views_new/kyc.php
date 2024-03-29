<!DOCTYPE html>
<html lang="en">

<head>
  <title>Relai</title>
  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
    integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
  <!-- Style CSS -->
  <link rel="stylesheet" type="text/css" href="style.css">
  <!-- fonts CSS -->
  <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <!-- Animate CSS -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.0.0/animate.min.css" />
</head>

<body>
  <div class="container">

    <div class="row">
      <div class="col-lg-7 signup">
        <div class="clearfix">
          <div class="logo-signup float-left">
            <a class="navbar-brand" href="index.html"><img src="images/logo-2.png" class="d-inline-block align-top"></a>
          </div>

        </div>
        <p>KYC</p>
        <h1>Upload documents</h1>
        <div class="row">
          <div class="kyc-box-section">
            <div class="kyc-box">
              <div class="pending-icon">
                <img src="images/pending.png" alt="">&nbsp;<span class="pending">Pending </span>
              </div>
              <div class=kyc-section>
                <img src="images/id.png">
              </div>
              <div class="driving-liences">
                <p>Driving License<span><img src="images/drop-down.png"></span></p>
              </div>
              <div class="upload">
                <a href="#">Upload</a>
              </div>
              <span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span>
            </div>

            <div class="box-content">
              <p>Who are you? (ID verification)</p>
            </div>
          </div>

          <div class="kyc-box-section">
            <div class="kyc-box">
              <div class="pending-icon">
                <img src="images/pending.png" alt="">&nbsp;<span class="pending">Pending </span>
              </div>
              <div class=kyc-section>
                <img src="images/bill.png">
              </div>
              <div class="driving-liences">
                <p>Utility Bill<span><img src="images/drop-down.png"></span></p>
              </div>
              <div class="upload">
                <a href="#">Upload</a>
              </div>
              <span>
                  <div class="custom-file-input">
                    <input type="file">
                    <input type="button">
                  </div>
                </span>
            </div>
            
            <div class="box-content">
              <p>Utility Bill in the last 6 months</p>
            </div>
          </div>
        </div>
        <div class="submit-btn-fix">
          <button type="submit" class="btn btn-next">SUBMIT</button>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="kyc-image-section">
          <img class="" src="images/kyc.png" alt="">
        </div>
      </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
      integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
      crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
      integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
      crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"
      integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
      crossorigin="anonymous"></script>
    <script>
      $(document).ready(function () {
        $(".sidenav ul li").click(function () {
          $(".sidenav ul li").removeClass("active");
          $(this).addClass("active");
        });
      });
      $(document).ready(function () {
        $(".right-navbar li").click(function () {
          $("right-navbar li").removeClass("active");
          $(this).addClass("active");
        });
      });
    </script>
    <script>
    $(document).ready(function () {
      $('.custom-file-input input[type="file"]').change(function (e) {
        $(this).siblings('input[type="text"]').val(e.target.files[0].name);
      });
    });
  </script>
</body>

</html>