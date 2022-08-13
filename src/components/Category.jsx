import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { FiSearch } from 'react-icons/fi';
import { BsPlus } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { CardProduct } from '../components/Card';
import { useSelector } from 'react-redux';

export function Category() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [user, setUser] = useState({});
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState('');
  const searching = useSelector((state) => state.search.search);

  const categories = category ? `&category=${category}` : '';
  const searched = searching ? `&name=${searching}` : '';

  const sellButton = () => {
    isLoggedIn ? (user.city ? navigate('/createproduct') : navigate(`/updateacc/${user.id}`)) : navigate('/login');
  };

  const getProductPublish = async () => {
    try {
      const dataProduct = await axios.get(`https://be-finalproject.herokuapp.com/api/filter?sold=false&isPublish=true${categories}${searched}`);

      const payloadData = await dataProduct.data.data.data;
      setProduct(payloadData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const validateLogin = async (e) => {
      try {
        // Check status user login
        // 1. Get token from localStorage
        const token = localStorage.getItem('token');

        // 2. Check token validity from API
        const currentUserRequest = await axios.get('https://be-finalproject.herokuapp.com/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentUserResponse = currentUserRequest.data;

        if (currentUserResponse.status) {
          setUser(currentUserResponse.data.user);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    validateLogin();
    getProductPublish();
  }, [categories, searching]);

  return (
    <>
      <Container className="category mb-4">
        <h6 className="fw-bold">Telusuri Kategori</h6>
        <div>
          <div className="d-flex gap-3 button-category">
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory(null)}>
              <FiSearch className="align-self-center" /> Semua
            </Button>
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory('Hobi')}>
              <FiSearch className="align-self-center" /> Hobi
            </Button>
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory('Kendaraan')}>
              <FiSearch className="align-self-center" /> Kendaraan
            </Button>
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory('Baju')}>
              <FiSearch className="align-self-center" /> Baju
            </Button>
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory('Elektronik')}>
              <FiSearch className="align-self-center" /> Elektronik
            </Button>
            <Button className="d-flex gap-1 px-3" variant="primary" onClick={() => setCategory('Kesehatan')}>
              <FiSearch className="align-self-center" /> Kesehatan
            </Button>
          </div>

          <Button className="d-flex gap-2 px-3 py-2 fixed-bottom button-sell mb-4" onClick={sellButton}>
            <BsPlus className="align-self-center " style={{ fontSize: '24px' }} /> Jual
          </Button>
        </div>
      </Container>

      <CardProduct product={product} />
    </>
  );
}
