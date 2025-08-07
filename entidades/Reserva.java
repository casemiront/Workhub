package entidades;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class Reserva implements Serializable {
    private static final long serialVersionUID = 1L;
    private int id;
    private Cliente cliente;
    private Espaco espaco;
    private LocalDate dataReserva;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private double valorTotal;
    private List<ServicoAdicional> servicosAdicionais;

    public Reserva(int id, Cliente cliente, Espaco espaco, LocalDate dataReserva, LocalTime horaInicio, LocalTime horaFim) {
        this.id = id;
        this.cliente = cliente;
        this.espaco = espaco;
        this.dataReserva = dataReserva;
        this.horaInicio = horaInicio;
        this.horaFim = horaFim;
        this.servicosAdicionais = new ArrayList<>();
        calcularValorTotal();
    }

    // Getters
    public int getId() {
        return id;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public Espaco getEspaco() {
        return espaco;
    }

    public LocalDate getDataReserva() {
        return dataReserva;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public LocalTime getHoraFim() {
        return horaFim;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public List<ServicoAdicional> getServicosAdicionais() {
        return servicosAdicionais;
    }

    // Setters
    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public void setEspaco(Espaco espaco) {
        this.espaco = espaco;
    }

    public void setDataReserva(LocalDate dataReserva) {
        this.dataReserva = dataReserva;
    }

    public void setHoraInicio(LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public void setHoraFim(LocalTime horaFim) {
        this.horaFim = horaFim;
    }

    public void adicionarServico(ServicoAdicional servico) {
        this.servicosAdicionais.add(servico);
        calcularValorTotal();
    }

    public void removerServico(ServicoAdicional servico) {
        this.servicosAdicionais.remove(servico);
        calcularValorTotal();
    }

    public void calcularValorTotal() {
        long duracaoHoras = java.time.Duration.between(horaInicio, horaFim).toHours();
        this.valorTotal = espaco.getValorHora() * duracaoHoras;
        for (ServicoAdicional servico : servicosAdicionais) {
            this.valorTotal += servico.getValorTotal();
        }
    }

    @Override
    public String toString() {
        return "Reserva [ID=" + id + ", Cliente=" + cliente.getNome() + ", Espaço=" + espaco.getNome() +
                ", Data=" + dataReserva + ", Início=" + horaInicio + ", Fim=" + horaFim +
                ", Valor Total=" + String.format("%.2f", valorTotal) + ", Serviços Adicionais=" + servicosAdicionais.size() + "]";
    }
}
