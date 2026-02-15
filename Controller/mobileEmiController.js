import MobileEmi from "../Models/MobileEmi.js";

/**
 * EMI Calculation Formula
 */
const calculateEmi = (price, downPayment, rate, months) => {
  const principal = price - downPayment;
  const monthlyRate = rate / 12 / 100;

  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(emi);
};

/**
 * CREATE EMI
 */
export const createMobileEmi = async (req, res) => {
  try {
    const {
      customerName,
      mobileBrand,
      mobileModel,
      mobilePrice,
      downPayment,
      emiMonths,
      interestRate
    } = req.body;

    const monthlyEmi = calculateEmi(
      mobilePrice,
      downPayment,
      interestRate,
      emiMonths
    );

    const totalAmount = monthlyEmi * emiMonths + downPayment;

    const emi = await MobileEmi.create({
      customerName,
      mobileBrand,
      mobileModel,
      mobilePrice,
      downPayment,
      emiMonths,
      interestRate,
      monthlyEmi,
      totalAmount
    });

    res.status(201).json({
      success: true,
      message: "Mobile EMI created successfully",
      data: emi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL EMI
 */
export const getAllMobileEmi = async (req, res) => {
  try {
    const emis = await MobileEmi.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: emis
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET EMI BY ID
 */
export const getMobileEmiById = async (req, res) => {
  try {
    const emi = await MobileEmi.findById(req.params.id);

    if (!emi) {
      return res.status(404).json({
        success: false,
        message: "EMI record not found"
      });
    }

    res.status(200).json({
      success: true,
      data: emi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE EMI
 */
export const updateMobileEmi = async (req, res) => {
  try {
    const emi = await MobileEmi.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "EMI updated successfully",
      data: emi
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE EMI
 */
export const deleteMobileEmi = async (req, res) => {
  try {
    await MobileEmi.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "EMI deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
