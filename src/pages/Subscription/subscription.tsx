import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { all_routes } from "../../feature-module/router/all_routes";
import api from "../../core/data/api";
import "../Subscription/subscription.css";
import Loading from "../../core/common/loader/Loading";
import moment from "moment";
import { toast } from "react-toastify";

const Subscription = () => {
  const routes = all_routes;
  const [id, setId] = useState<string>("");
  const [loader, setLoader] = useState<boolean>(false);
  const [plans, setPlans] = useState<any[]>([]);

  const fetchPlans = async () => {
    setLoader(true);
    try {
      const res = await api.post("/api/mssql-procedure/execute/get", {
        procedureName: "SubscriptionGetAll",
      });
      if (res.data.success) {
        const mappedPlans = res.data.centers.map(
          (center: any, index: number) => ({
            key: index + 1,
            _id: center.ID,
            name: center.PLANS,
            price: center.AMOUNT,
            description: center.description,
            createdAt: center.createdAt,
            duration: center.PLANS || "month",
            type: center.type || "Standard",
            features: Array.isArray(center.description)
              ? center.description
              : center.description?.split(",") || [],
          })
        );
        setPlans(mappedPlans);
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async () => {
    try {
      setLoader(true);
      const res = await api.post("/api/mssql-procedure/execute", {
        procedureName: "SubscriptionDelete",
        parameters: [{ name: "ID", type: "Int", value: id }],
      });
      if (res.data.success) {
        toast.success("Subscription deleted successfully");
        await fetchPlans();
      }
    } catch (error) {
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content plans">
        <div className="d-md-flex d-block align-items-center justify-content-between mb-3">
          <div className="my-auto mb-2">
            <h3 className="page-title mb-1">Subscription Plans</h3>
          </div>
          <div className="d-flex my-xl-auto right-content justify-content-end flex-wrap">
            <div className="mb-2">
              <Link
                to={all_routes.addSubscription}
                className="btn btn-primary d-flex align-items-center"
              >
                <i className="ti ti-square-rounded-plus me-2" />
                Add Subscriptions
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          {loader ? (
            <div
              className="d-flex justify-content-center align-items-center w-100"
              style={{ height: "50vh" }}
            >
              <Loading />
            </div>
          ) : plans.length > 0 ? (
            plans.map((plan) => (
            <div key={plan._id} className="col-xl-4 col-lg-6 col-md-6 col-sm-12 mb-4">
              <div className="card  subscription-card hover-effect">
                <div className="card-body d-flex flex-column">
                  {/* Plan Header */}
                  <div className="text-center mb-4">
                    <span
                      className="badge mb-3 px-3 py-2 fs-4.5 fw-medium"
                      style={{
                        backgroundColor:
                          plan.name === "monthly"
                            ? "var(--bs-info)"
                            : plan.name === "yearly"
                            ? "var(--bs-warning)"
                            : "var(--bs-primary)",
                        color: "white",
                      }}
                    >
                      {plan.name.charAt(0).toUpperCase() + plan.name.slice(1)}
                    </span>
                    <h5 className="text-muted mb-0">
                      {plan.name === "monthly"
                        ? "Continuous monthly skill development"
                        : plan.name === "yearly"
                        ? "Best value for all-year academic success"
                        : "Focused learning tailored to your course"}
                    </h5>
                  </div>

                  {/* Price Display */}
                  <div className="bg-light p-4 rounded-3 text-center mb-4">
                    <h2 className="display-7 fw-bold text-primary mb-0">
                      ₹{plan.price.toLocaleString()}
                      <span className="text-muted fs-4 fw-normal ms-1">
                        /{plan.name === "yearly" ? "Year" : "Month"}
                      </span>
                    </h2>
                    {plan.discount && (
                      <div className="text-success small mt-2">
                        Save {plan.discount}% compared to monthly
                      </div>
                    )}
                  </div>

                  {/* Features List */}
                  <ul className="list-unstyled mb-4 flex-grow-1">
                    {plan.features.map((feature: string, index: number) => (
                      <li className="mb-3" key={index}>
                        <div className="d-flex align-items-start">
                          <span className="flex-shrink-0 text-success mt-1 me-2">
                          <i className="ti ti-circle-check-filled fs-15 align-middle" />
                          </span>
                          <div className="flex-grow-1">{feature}</div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Action Buttons */}
                  <div className="d-grid gap-2 d-md-flex">
                    <Link
                      to={`/editSubscription/${plan._id}`}
                      className="btn btn-primary flex-grow-1"
                    >
                      <i className="ti ti-edit me-2"></i>Edit
                    </Link>
                    <button
                      className="btn btn-outline-danger flex-grow-1"
                      data-bs-toggle="modal"
                      data-bs-target="#delete-modal"
                      onClick={() => setId(plan._id)}
                    >
                      <i className="ti ti-trash me-2"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
          ) : (
            <p>Oops! No Subscription found yet.</p>
          )}
        </div>
      </div>

      <div className="modal fade" id="delete-modal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body text-center">
              <span className="delete-icon">
                <i className="ti ti-trash-x" />
              </span>
              <h4>Confirm Deletion</h4>
              <p>This action is permanent and cannot be undone.</p>
              <div className="d-flex justify-content-center">
                <button className="btn btn-light me-3" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                  data-bs-dismiss="modal"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
