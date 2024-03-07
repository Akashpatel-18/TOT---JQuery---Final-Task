var isValid = true;
var currentSelectionId = 0;
let currentData = [];
let getDataBYid = {};
let page = 1;
let pageLimit = document.querySelector(".pageInput").value;
let paginationContent;
var BaseUrl = new URL(
  "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo"
);
let apiLength;
let pageLinks;
let lastPage;
let prevBtn;
let nextBtn;
let totalEnquiries;
let totalMaleEnquiries;
let totalFemaleEnquiries;
let summaryApiData;
let j = 1;
let filterToggle = true;
let modalClose = 0;
let newData;

getApiLength();

$(".showStats").click(() => {
  $("#summaryBox").slideToggle("slow");
});

$("#createModal").click(() => {
  $("#addLabel").text("Add Employee");
  $("#submitBtn")
    .removeClass("btn-success")
    .addClass("btn-primary")
    .text("Add");
});

$(".btnClose").click(() => {
  $("#myForm").trigger("reset");
  $("#nameError").text("");
  $("#emailError").text("");
  $("#phoneError").text("");
  $("#genderError").text("");
  $("#enquiryError").text("");
  $("#messageError").text("");
  currentSelectionId = 0;
  getDataBYid = {};
});

$("#myForm").submit((e) => {
  e.preventDefault();

  if (!Number(currentSelectionId)) {
    validateForm();
  } else {
    isValid = true;
  }

  if (
    isValid &&
    $("#name").val() !== "" &&
    $("#email").val() !== "" &&
    $("#phone").val() !== "" &&
    $("input[type='radio'][name='gender']:checked").val() !== "" &&
    $("#enquiry :selected").val() !== "" &&
    $("#message").val() !== "" &&
    $("#nameError").text() === "" &&
    $("#emailError").text() === "" &&
    $("#phoneError").text() === "" &&
    $("#genderError").text() === "" &&
    $("#enquiryError").text() === "" &&
    $("#messageError").text() === ""
  ) {
    if (currentSelectionId) {
      updateData();
    } else {
      postData();
    }

    $("#myForm").trigger("reset");

    $("#staticBackdrop").modal("hide");
  } else {
    return false;
  }
});

function getApiLength() {
  $.ajax({
    type: "GET",
    url: "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo",
    dataType: "json",
    beforeSend: function (e) {
      $("#showAllData").hide();
      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      $("#showAllData").show();
    },
    success: function (response) {
      $(".summaryList").html("");
      summaryApiData = response;

      newData = response.map((x) => x).reverse();

      apiLength = summaryApiData.length;
      totalEnquiries = $("#enquiry > option").length - 1;
      totalMaleEnquiries = summaryApiData.filter(
        (x) => x.gender === "Male"
      ).length;
      totalFemaleEnquiries = summaryApiData.filter(
        (x) => x.gender === "Female"
      ).length;

      let summaryData = "";
      summaryData += `
        <div class="d-flex align-items-center gap-2 mb-2">
          <label class="summaryLabel">Total Entry : </label>
          <span class="text-muted">${apiLength}</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <label class="summaryLabel">Total Enquiries : </label>
          <span class="text-muted">${totalEnquiries}</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <label class="summaryLabel">Total Male Enquiries : </label>
          <span class="text-muted">${totalMaleEnquiries}</span>
        </div>
        <div class="d-flex align-items-center gap-2 mb-2">
          <label class="summaryLabel">Total Female Enquiries: </label>
          <span class="text-muted">${totalFemaleEnquiries}</span>
        </div>
        `;

      $(".summaryList").append(summaryData);
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function currentPage(index) {
  page = index;

  pagination();
}

function previousPage() {
  page -= 1;
  if (page < 1) {
    page += 1;
    return 0;
  }
  pagination();
}

function nextPage() {
  page += 1;
  if (page > lastPage) {
    page -= 1;
    return 0;
  }
  pagination();
}

function pagination() {
  $(".leftPart").html("");
  BaseUrl.searchParams.delete("page");
  BaseUrl.searchParams.delete("limit");

  BaseUrl.searchParams.append("page", page);
  BaseUrl.searchParams.append("limit", pageLimit);
  lastPage = Math.ceil(apiLength / pageLimit);
  paginationContent = "";
  paginationContent += `
        <nav aria-label="..." class="paginate">
        <ul class="pagination flex-wrap">
          <li class="prevBtn page-item" onclick=previousPage()>
            <a class="page-link" href="#"
              >Previous</a
            >
          </li>`;
  if (lastPage) {
    for (let i = 1; i <= Math.ceil(apiLength / Number(pageLimit)); i++) {
      paginationContent += `<li class="pageLink page-item" onclick=currentPage(${i}) ><a class="page-link" href="#" >${i}</a></li>`;
    }
  }

  paginationContent += `
          <li class="nextBtn page-item" onclick=nextPage()>
            <a class="page-link" href="#">Next</a>
          </li>
          </ul>
          </nav>`;

  $(".leftPart").append(paginationContent);
  prevBtn = document.querySelector(".prevBtn");
  nextBtn = document.querySelector(".nextBtn");
  pageLinks = document.querySelectorAll(".pageLink");
  if (pageLinks && page === 1) {
    let firstPage = pageLinks[0];
    firstPage?.classList.add("active");
    prevBtn.classList.add("disabled");
    prevBtn.style.cursor = "not-allowed";
  } else if (lastPage === page) {
    nextBtn.classList.add("disabled");
    nextBtn.style.cursor = "not-allowed";
    pageLinks[pageLinks.length - 1].classList.add("active");
  } else {
    for (let i = 0; i < pageLinks.length; i++) {
      pageLinks[i].classList.remove("active");
      if (i === page - 1) {
        pageLinks[i].classList.add("active");
      }
    }
  }
  getData();
}

document.querySelector(".pageInput").addEventListener("change", (e) => {
  let pageLimitExceed = Number(e.target.value);
  if (isNaN(pageLimitExceed)) {
    let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
    $("#tbody").html("");
    $("#tbody").append(noFound);
    $(".paginate").hide();
    return;
  }
  if (pageLimitExceed > apiLength) {
    let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
    $("#tbody").html("");
    $("#tbody").append(noFound);
    $(".paginate").hide();
  } else if (pageLimitExceed === 0) {
    let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
    $("#tbody").html("");
    $("#tbody").append(noFound);
    $(".paginate").hide();
  } else if (pageLimitExceed === apiLength) {
    pageLimit = pageLimitExceed;
    page = 1;
    pagination();
    $(".paginate").hide();
    return;
  } else {
    pageLimit = pageLimitExceed;
    page = 1;
    $(".paginate").show();
    pagination();
  }
});

const inputElement = document.getElementById("searchInput");

$("#searchInput").change(function () {
  BaseUrl.searchParams.delete("search");

  BaseUrl.searchParams.append("search", $("#searchInput").val());
  getData();
  page = 1;
  pagination();
});

function getData() {
  $.ajax({
    type: "GET",
    url: BaseUrl,
    dataType: "json",
    beforeSend: function (e) {
      $("#showAllData").hide();
      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      $("#showAllData").show();
    },
    success: function (response) {
      currentData = response;
      $("#tbody").html("");

      let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
      if (response && response.length > 0) {
        let data = "";

        response.map((item) => {
          data += `
            <tr>
            <td class="nameRow">${item.name}</td>
            <td class="emailRow">${item.email}</td>
            <td class="phoneRow">${item.phone}</td>
            <td class="genderRow">${item.gender}</td>
            <td class="enquiryRow">${item.enquiry}</td>
            <td class="messageRow">
            ${item.message}
            </td>
            <td>
              <span
                class="d-flex align-items-center gap-2"
              >
                <i id="editModal" class="fa-solid fa-pen box-shadow-xl" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop" onclick=patchData(${item.id})></i>
                <i class="fa-solid fa-trash box-shadow-xl" data-bs-toggle="modal"
                data-bs-target="#staticBackdrop2" onclick=removeData(${item.id})></i>
              </span>
            </td>
          </tr>
            `;
        });

        $("#tbody").append(data);

        getApiLength();

        if (response && response.length > 10) {
          if (j > 0) {
            setTimeout(() => {
              pagination();
            }, 100);

            getApiLength();
            j -= 1;
          }
        }
      } else {
        $("#tbody").append(noFound);
      }
    },
    error: function (err) {
      let noFound = `<div class="text-center fw-bold fs-5 d-block mt-2 mb-2">No Record Found</div>`;
      $("#tbody").html("");
      $("#tbody").append(noFound);
      $(".paginate").hide();
    },
  });
}

getData();

function nameFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "name");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "name");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

function emailFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "email");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "email");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

function phoneFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "phone");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "phone");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

function genderFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "gender");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "gender");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

function enquiryFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "enquiry");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "enquiry");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

function messageFilter() {
  BaseUrl.searchParams.delete("sortBy");
  BaseUrl.searchParams.delete("order");

  if (filterToggle) {
    BaseUrl.searchParams.append("sortBy", "message");
    BaseUrl.searchParams.append("order", "asc");

    filterToggle = !filterToggle;
  } else {
    BaseUrl.searchParams.append("sortBy", "message");
    BaseUrl.searchParams.append("order", "desc");

    filterToggle = !filterToggle;
  }

  page = 1;
  getData();
}

let name;
let email;
let phone;
let gender;
let enquiry;
let message;
function getFormData() {
  return {
    name: $("#name").val(),
    email: $("#email").val(),
    phone: $("#phone").val(),
    gender: $("input[type='radio'][name='gender']:checked").val(),
    enquiry: $("#enquiry").find(":selected").val(),
    message: $("#message").val(),
  };
}

function postData() {
  let formData = getFormData();
  $.ajax({
    type: "POST",
    url: "https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo",
    data: formData,
    dataType: "json",
    beforeSend: function (e) {
      $("#showAllData").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      $("#showAllData").show();
    },
    success: function (response) {
      getData();
    },
    error: function (err) {
      console.error(err.status);
    },
  });
}

function updateData() {
  let formData = getFormData();
  $.ajax({
    type: "PUT",
    url: `https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo/${currentSelectionId}`,
    data: formData,
    dataType: "json",
    beforeSend: function (e) {
      $("#showAllData").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      $("#showAllData").show();
    },
    success: function (response) {
      getData();
      currentSelectionId = 0;
      getDataBYid = {};
    },
    error: function (err) {
      console.log(err);
    },
  });
}

function modalHeader() {
  $("#addLabel").text("Edit Employee");
  $("#submitBtn")
    .removeClass("btn-primary")
    .addClass("btn-success")
    .text("Save");
}

function patchData(id) {
  getDataBYid = currentData.find((f) => f.id == id);
  if (getDataBYid) {
    currentSelectionId = getDataBYid.id;

    modalHeader();

    $("#name").val(getDataBYid.name);
    $("#email").val(getDataBYid.email);
    $("#phone").val(getDataBYid.phone);
    $(`input[name='gender'][value='${getDataBYid.gender}']`).prop(
      "checked",
      true
    );
    $("#enquiry").val(getDataBYid.enquiry);
    $("#message").val(getDataBYid.message);
  }
}

function removeData(id) {
  getDataBYid = currentData.find((f) => f.id == id);
  currentSelectionId = id;
  $("#deleteBtn").click(() => {
    deleteRecord(id);
    $("#staticBackdrop2").modal("hide");
  });
}

function deleteRecord(id) {
  $.ajax({
    type: "DELETE",
    url: `https://65e19ca3a8583365b316d3e2.mockapi.io/api/v1/CRUDDemo/${id}`,
    dataType: "json",
    beforeSend: function (e) {
      $("#showAllData").hide();

      $("#loader").show();
    },
    complete: function (e) {
      $("#loader").hide();
      $("#showAllData").show();
    },
    success: function (response) {
      getData();
      currentSelectionId = 0;
      getDataBYid = {};
    },
    error: function (err) {
      console.log(err);
    },
  });
}

// -----------------validation-------------------
function validateForm() {
  let name = $("#name").val().trim();
  if (name === "") {
    $("#nameError").text("name is required");
    isValid = false;
  }

  let email = $("#email").val().trim();
  if (email === "") {
    $("#emailError").text("email is required");
    isValid = false;
  }

  let phone = $("#phone").val().trim();
  if (phone === "") {
    $("#phoneError").text("phone is required");
    isValid = false;
  }

  let selectedGender = $("input[type='radio'][name='gender']:checked");
  if (!selectedGender.length > 0) {
    $("#genderError").text("gender is required");
    isValid = false;
  }

  let enquiry = $("#enquiry :selected").val();
  if (!enquiry) {
    $("#enquiryError").text("enquiry is required");
    isValid = false;
  }

  let message = $("#message").val().trim();
  if (message === "") {
    $("#messageError").text("message is required");
    isValid = false;
  }
}

$("#myForm").change(function (e) {
  e.preventDefault();

  if ($("input[type='radio']:checked")) {
    $("#genderError").text("");
    isValid = true;
  }
});

$("#name").keyup(function () {
  nameCheck();
  if (isValid) {
    $("#nameError").text("");
  }
});

$("#email").keyup(function () {
  emailCheck();
  if (isValid) {
    $("#emailError").text("");
  }
});

$("#phone").keyup(function () {
  phoneCheck();
  if (isValid) {
    $("#phoneError").text("");
  }
});

$("#gender").keyup(function () {
  var checkbox_value = $("input[type='radio'][name='gender']:checked");

  if (!checkbox_value) {
    $("#genderError").text("gender is required");
    isValid = false;
  } else {
    $("#genderError").text("");
    isValid = true;
  }
});

$("select#enquiry").change(function () {
  var selectedEnquiry = $("#enquiry option:selected").val();
  if (!selectedEnquiry) {
    $("#enquiryError").text("enquiry is required");
    isValid = false;
  } else {
    $("#enquiryError").text("");
    isValid = true;
  }
});

$("#message").keyup(function () {
  messageCheck();
  if (isValid) {
    $("#messageError").text("");
  }
});

function nameCheck() {
  let name = $("#name").val().trim();
  if (name === "") {
    $("#nameError").text("name is required");
    isValid = false;
  } else if (!isNaN(name)) {
    $("#nameError").text("please enter valid username");
    isValid = false;
  } else {
    isValid = true;
  }
}

function emailCheck() {
  let email = $("#email").val().trim();
  if (email === "") {
    $("#emailError").text("email is required");
    isValid = false;
  } else if (!isValidEmail(email)) {
    $("#emailError").text("please enter valid email");
    isValid = false;
  } else {
    isValid = true;
  }
}

function isValidEmail(email) {
  let emailRegex =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRegex.test(email);
}

function phoneCheck() {
  let phone = $("#phone").val().trim();
  if (phone === "") {
    $("#phoneError").text("phone is required");
    isValid = false;
  } else if (isNaN(phone)) {
    $("#phoneError").text("please enter valid phone");
    isValid = false;
  } else {
    isValid = true;
  }
}

function messageCheck() {
  let message = $("#message").val().trim();
  if (message === "") {
    $("#messageError").text("message is required");
    isValid = false;
  } else if (!isNaN(message)) {
    $("#messageError").text("please enter valid message");
    isValid = false;
  } else {
    isValid = true;
  }
}
