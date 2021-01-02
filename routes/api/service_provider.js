const express = require("express");
const router = express.Router();

const { service_provider_register, service_provider_signin, service_provider_personal_details, service_provider_other_details, service_provider_Indemnity_details, service_provider_Roles, service_provider_education, service_provider_employment_history, service_provider_language, service_provider_plan, service_provider_portfolio, service_provider_reference, pricing_plan } = require("../../controllers/service_providers");


router.post("/service_provider_register", service_provider_register);

router.post("/service_provider_personal_details", service_provider_personal_details);
router.post("/service_provider_other_details", service_provider_other_details);
router.post("/service_provider_indemnity_details", service_provider_Indemnity_details);
router.post("/service_provider_roles", service_provider_Roles);
router.post("/service_provider_education", service_provider_education);
router.post("/service_provider_employment_history", service_provider_employment_history);
router.post("/service_provider_language", service_provider_language);
router.post("/service_provider_plan", service_provider_plan);
router.post("/service_provider_portfolio", service_provider_portfolio);
router.post("/service_provider_reference", service_provider_reference);
router.post("/service_provider_signin", service_provider_signin);


router.post("/pricing_plan", pricing_plan);


module.exports = router;
