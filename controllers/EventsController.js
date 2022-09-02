const { Op } = require('sequelize');
const EventModel = require('../models/Event');

class EventsController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.title) {
      where.title = {
        [Op.iLike]: `%${params.title}%`
      };
    }

    // if (params.start) {
    //   where.start = {
    //     [Op.eq]: `%${params.start}%`
    //   };
    // }

    // if (params.end) {
    //   where.end = {
    //     [Op.iLike]: `%${params.end}%`
    //   };
    // }

    if (params.location) {
      where.location = {
        [Op.iLike]: `%${params.location}%`
      };
    }

    if (params.online) {
      where.online = {
        [Op.eq]: params.online
      };
    }

    if (params.feriado) {
      where.feriado = {
        [Op.eq]: params.feriado
      };
    }

    if (params.value) {
      where.value = {
        [Op.eq]: params.value
      };
    }

    if (params.min_value) {
      where.value = {
        [Op.gte]: params.min_value
      };
    }

    if (params.max_value) {
      if (!where.value) {
        where.value = {};
      }
      where.value[Op.lte] = params.max_value;
    }

    const events = await EventModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(events);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const event = await EventModel.create(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const event = await EventModel.findByPk(req.params.eventId);
    res.json(event);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.eventId;
      const data = await this._validateData(req.body, id);
      await EventModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await EventModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await EventModel.destroy({
      where: {
        id: req.params.eventId
      }
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['title', 'start', 'end', 'online'];
    const event = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      event[attribute] = data[attribute];
    }

    if (await this._checkFeriado(event.start)) {
      event.feriado = true;
    } else { event.feriado = false; }

    return event;
  }

  _checkFeriado = async (dateTime) => {

    const axios = require('axios');

    dateTime = String(dateTime);

    const feriados = await axios.get(`https://brasilapi.com.br/api/feriados/v1/202${dateTime.charAt(3)}`).then((response) => {
      const fer = response.data;
      return fer;
    })

    let onlyDate = '';
    for (let i = 0; i < 10; i++) {
      onlyDate += dateTime.charAt(i);
    }
    console.log('>>>' + onlyDate + '<<<')

    let val = false;

    for (let i = 0; i < feriados.length; i++) {
      if (feriados[i].date == onlyDate) {
        val = true;
      };
    }

    return val;
  }

}

module.exports = new EventsController();
