// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Spinner,
  Button,
  ModalBody,
  Modal,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import FeedbackCard from "../components/FeedbackCard";
import { title } from "@/components/primitives";
import AddFeedbackForm from "../components/AddFeedbackForm";

interface Usuario {
  id: string;
  email: string;
  senha: string;
  nome: string;
}

interface Feedback {
  _id: string;
  titulo: string;
  descricao: string;
  loja: string;
  produto: string;
  curtidas: number;
  midia: [];
  id_usuario: string;
  createdAt: string;

  usuario: Usuario;
}

export default function Dashboard() {
  const { token, user, logout } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const router = useRouter();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/home`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data: Feedback[] = await res.json();
        setFeedbacks(data);
      } else {
        const errorData = await res.json();

        setError(errorData.message || "Erro ao obter feedbacks.");
      }
    } catch (err) {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/likefeedbacks/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const updatedFeedback: Feedback = await res.json();

        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((fb) =>
            fb._id === id ? { ...fb, curtidas: updatedFeedback.curtidas } : fb
          )
        );
      } else {
        const errorData = await res.json();

        throw new Error(errorData.message || "Erro ao curtir feedback.");
      }
    } catch (err: any) {
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      return;
    }

    const confirmDelete = confirm(
      "Tem certeza que deseja deletar este feedback?"
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();

        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((fb) => fb._id !== id)
        );
        alert("Feedback deletado com sucesso!");
      } else {
        const errorData = await res.json();

        throw new Error(errorData.message || "Erro ao deletar feedback.");
      }
    } catch (err: any) {
      alert(err.message || "Erro ao deletar feedback.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigationFeedback = async () => {
    router.push("/meus-feedbacks");
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold ">
            <span className={title({ color: "violet", size: "sm" })}>Feed</span>
            <span className={title({ size: "sm" })}>Back</span>
          </span>
          <div className="flex flex-wrap gap-4 items-center">
            <Button
              color="primary"
              disabled={loading}
              variant="bordered"
              onClick={fetchFeedbacks}
            >
              Atualizar
            </Button>

            <Button
              color="secondary"
              variant="bordered"
              onClick={handleNavigationFeedback}
            >
              Meus Feedbacks
            </Button>
            <Button color="primary" variant="flat" onPress={onOpen}>
              Adicionar Feedback
            </Button>
            <Button color="danger" variant="bordered" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <Modal
            isOpen={isOpen}
            placement="top-center"
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <AddFeedbackForm
                      onCloseFeedback={onClose}
                      onFeedbackAdded={fetchFeedbacks}
                    />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum feedback encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                onDelete={handleDelete}
                onFetchFeedback={fetchFeedbacks}
                onLike={handleLike}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
